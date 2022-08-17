
const scrollContent = document.querySelector(".msg_card_body");
if(scrollContent) {
    scrollContent.scrollTo(0,scrollContent.scrollHeight);
}

let input_message = $('#input-message')
let message_body = $('.msg_card_body')
let send_message_form = $('#send-message-form')
const USER_ID = $('#logged-in-user').val()

let loc = window.location
let wsStart = 'ws://'

if(loc.protocol === 'https') {
    wsStart = 'wss://'
}

let endpoint = wsStart + loc.host + loc.pathname

var socket = new WebSocket(endpoint)


socket.onopen = async function(e) {
    console.log('open', e)
    send_message_form.on('submit', function (e){
        e.preventDefault()
//        console.log('message', message)
        let message = input_message.val()
        let send_to;

        if( USER_ID == 1 )
            send_to = 2
        else
            send_to = 1

//        console.log('2user', send_to)
        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to
        }

        data = JSON.stringify(data)
        socket.send(data)
        $(this)[0].reset()
    })
}

socket.onmessage = async function(e){
//    console.log('salom')
    console.log('message',e)
    let data = JSON.parse(e.data)
    let message = data['message']
    newMessage(message)
}

socket.onerror = async function(e){
    console.log('eror',e)
}

socket.onclose = async function(e){
    console.log('closed', e)
}


function newMessage(message) {
    setTimeout(() => {
        let scrollDiv = document.getElementById("scrollDiv");
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
            console.log("Working");
        }, 150);
        // console.log(scrollDiv.scrollHeight)
	if ($.trim(message) === '') {
		return false;
	}
	// let message_element;
	// let chat_id = 'chat_' + thread_id
	// if(sent_by_id == USER_ID){
	let message_element = `
			<div class="d-flex mb-4 replied">
				<div class="msg_cotainer_send">
					${message}
					<span class="msg_time_send">8:55 AM, Today</span>
				</div>
				<div class="img_cont_msg">
					<img src="img class="rounded-circle user_img_msg">
				</div>
			</div>
	    `
    
    // }

    // let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')
	message_body.append($(message_element))
    message_body.animate({
        scrollTop: $(document).height()
    }, 100);
	input_message.val(null);
}

$('.contact-li').on('click', function (){
    $('.contacts .actiive').removeClass('active')
    $(this).addClass('active')
    console.log("okey")

    // message wrappers
    let chat_id = $(this).attr('chat-id')
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[chat-id="' + chat_id +'"]').addClass('is_active')

})