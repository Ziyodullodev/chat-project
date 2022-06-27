import json
from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from .serializer import Userserializer, UserProfileserializer
from chat.models import Thread, ChatMessage
from users.models import UserProfile
User1 = get_user_model()


class Chatconsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        print('connected', event)
        user = self.scope['user']
        chat_room = f'user_chatroom_{user.id}'
        self.chat_room = chat_room
        await self.channel_layer.group_add(
            chat_room,
            self.channel_name
        )
        await self.send({
            'type': 'websocket.accept'
        })

    async def websocket_receive(self, event):
        print('resiver:', event)
        reseived_data = json.loads(event['text'])
        type = reseived_data.get('type')
        # if type == "send-message":
        msg = reseived_data.get('message')
        sent_by_id = reseived_data.get('sent_by')
        send_to_id = reseived_data.get('send_to')
        thread_id = reseived_data.get('thread_id')

        if not msg:
            print("EROR hello xabar")
            return False
        sent_by_user = await self.get_user_object(sent_by_id)
        send_to_user = await self.get_user_object(send_to_id)
        thread_obj = await self.get_thread_object(thread_id)
        print('THREAD',thread_obj)
        if not sent_by_user:
            print("sent by id yoq")
        if not send_to_user:
            print("send to id yoq")
        if not thread_obj:
            print("thread obj yoq")
        # print(type)
        if type == "send-message":
            await self.create_chat_message(thread_obj, sent_by_user, msg)

        other_user_chat_room = f'user_chatroom_{send_to_id}'

        self_user = self.scope['user']
        if type == "search-user":
            val = reseived_data.get('user')
            if val == "":
                resp = {
                    'type': "search",
                    'result':'null',
                }
            else:
                user_list = await self.get_user_object_name(val)
                
                if user_list is None:
                    resp = {
                        'type': "search",
                        'result':'nono',
                    }
                else:
                    ser = Userserializer(data=user_list, many=True)
                    
                    if ser.is_valid():
                        resp = {
                            'type': "search",
                            'result':'nono',
                        }
                    
                    else:
                        
                        resp = {
                            'type': "search",
                            'result':val,
                            'data':{
                                'users':ser.data
                            }
                        }

        else:
            resp = {
                'type': "sms",
                'message':msg,
                'sent_by': self_user.id,
                # 'sent_by_user': rasm,
                'thread_id':thread_id
            }
        # print("other",other_user_chat_room)
        # if type == "search-user":
        # await self.channel_layer.group_send(
        #     other_user_chat_room,
        #     {
        #         'type': 'chat_message',
        #         'text': json.dumps(resp)
        #     }
        # )
        # else:
        await self.channel_layer.group_send(
                other_user_chat_room,
                {
                    'type': 'chat_message',
                    'text': json.dumps(resp)
                }
            )
        # print("selflik",self.chat_room)
        await self.channel_layer.group_send(
            self.chat_room,
            {
                'type': 'chat_message',
                'text': json.dumps(resp)
            }
        )

    async def websocket_disconnect(self, event):
        print('disconnect:', event)

    async def chat_message(self, event):
        print('chat_message', event)
        await self.send({
            'type': 'websocket.send',
            'text': event['text']
        })
    async def search_user(self, event):
            print('search_user', event)
            await self.send({
                'type': 'websocket.send',
                'text': event['text']
            })

    @database_sync_to_async
    def get_user_object(self, user_id):
        usr = User1.objects.filter(id=user_id)
        if usr.exists():
            obj = usr.first()
        else:
            obj = None
        return obj

    @database_sync_to_async
    def get_user_object_name(self, user_name):
        usr = User.objects.filter(username__startswith=user_name)
        if usr:
            obj = usr
        else:
            obj = None
        return obj


    @database_sync_to_async
    def get_thread_object(self, thread_id):
        thread = Thread.objects.filter(id=thread_id)
        if thread.exists():
            obj = thread.first()
        else:
            obj = None
        return obj

    @database_sync_to_async
    def create_chat_message(self, thread_id, sent_id, msg):
        ChatMessage.objects.create(thread=thread_id, user=sent_id, message=msg)