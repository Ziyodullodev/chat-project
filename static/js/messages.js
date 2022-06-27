
let scrollDiv = document.getElementById("scrollDiv");
scrollDiv.scrollTop = scrollDiv.scrollHeight;

let input_message = $('#input-message')
let search_user = $('#search-user')
let search_form = $('#get-user')
let message_body = $('.msg_card_body')
let send_message_form = $('#send-message-form')
const USER_ID = $('#logged-in-user').val()

const searchInput = document.querySelector('#dialog_search-bar')


let loc = window.location
let wsStart = 'ws://'

if(loc.protocol === 'https') {
    wsStart = 'wss://'
}
let endpoint = wsStart + loc.host + loc.pathname

var socket = new WebSocket(endpoint)

socket.onopen = async function(e){

    console.log('open', e)
    send_message_form.on('submit', function (e){

        e.preventDefault()
        let message = input_message.val()
        let send_to = get_active_other_user_id()
        let thread_id = get_active_thread_id()
        let data = {
            'type':'send-message',
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'thread_id': thread_id
        }
        data = JSON.stringify(data)
        socket.send(data)
        $(this)[0].reset()
    })
    searchInput.addEventListener('input', e => {
        inputValue = e.target.value;
        console.log("inputValue", inputValue)
        let data = {
            'type':'search-user',
            'message': 'message',
            'sent_by': 1,
            'send_to': 2,
            'thread_id': 3,
            'user': inputValue,
        }
        data = JSON.stringify(data)
        socket.send(data)
        // $(this)[0].reset()
       })

}

socket.onmessage = async function(e){
    console.log('message', e)
    let data = JSON.parse(e.data)
    let type = data['type']
    if(type === 'search'){
        
        console.log("search")
        let result = data['result']
        if(result === 'nono'){
            // location.reload();
            let cont = document.querySelector('#contactsid')
            cont.innerHTML = '';
            
        }
        else if(result === 'null'){
            location.reload();
        }else{
        let data1 = data['data']
        let data2 = data1['users']
        console.log(data2)  
        for(let i = 0; i <= data2.length-1; i++){
            let search = `<li class="contact-li search" chat-id="chat_${data2[i]['id']}" style="cursor: pointer">
            <div class="d-flex bd-highlight">
                <div class="img_cont">
                    <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                   
                        <span>${data2[i]['username']}</span>
                    
                </div>
            </div>
        </li>`;
        let cont = document.querySelector('#contactsid')
        if(i === 0){
            cont.innerHTML = search;
        }else{
        cont.innerHTML += search;
        }
        }
        }
    }else{
        console.log("sms")
        let message = data['message']
        // console.log(message)
        let sent_by_id = data['sent_by']
        let thread_id = data['thread_id']
        newMessage(message, sent_by_id, thread_id)  
    }
}
socket.onerror = async function(e){
    console.log('error', e)
}

socket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id, thread_id) {
    setTimeout(() => {
        let scrollDiv = document.getElementById("scrollDiv");
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
            // console.log("Working");
        }, 150);
	if ($.trim(message) === '') {
		return false;
	}
    let your_img = $('.user-rasmi').val()
    let her_img = $('.her-user-rasmi').val()
	let chat_id = 'chat_' + thread_id
    let message_element;
	if( sent_by_id == USER_ID){
        message_element = `
			<div class="d-flex mb-4 replied">
				<div class="msg_cotainer_send">
					${message}
					
				</div>
				<div class="img_cont_msg">
					<img src="${your_img}" class="rounded-circle user_img_msg">
				</div>
                <span class="msg_time_send">8:55 AM, Today</span>
			</div>
	    `
    }else{
	 message_element = `
           <div class="d-flex mb-4 received">
              <div class="img_cont_msg">
                 <img src="${her_img}" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                 ${message}
              </div>
              <span class="msg_time">8:40 AM, Today</span>
           </div>
        `

    }


    let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')

	message_body.append($(message_element))
    message_body.animate({
        scrollTop: $(document).height()
    }, 100);

	input_message.val(null);

}

$('.img_cont').on('click', function (){
    console.log("okeyd")

})

$('.contact-li search').on('click', function (){
    // $('.contacts .active').removeClass('active')
    // $(this).addClass('active')
    let chat_id = $(this).attr('chat-id')
    // message wrappers
    // $('.messages-wrapper.is_active').removeClass('is_active')
    $('.card-footer').addClass('hidden')

})

$('.contact-li').on('click', function (){
    $('.contacts .active').removeClass('active')
    $(this).addClass('active')
    let chat_id = $(this).attr('chat-id')
    // message wrappers
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[chat-id="' + chat_id +'"]').addClass('is_active')

})

function get_active_other_user_id(){
    let other_user_id = $('.messages-wrapper.is_active').attr('other-user-id')
    other_user_id = $.trim(other_user_id)
    return other_user_id
}

function get_active_thread_id(){
    let chat_id = $('.messages-wrapper.is_active').attr('chat-id')
    let thread_id = chat_id.replace('chat_', '')
    return thread_id
}