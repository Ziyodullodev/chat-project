const scrollContent = document.querySelector(".msg_card_body");
if(scrollContent) {
    scrollContent.scrollTo(0,scrollContent.scrollHeight);
}


let input_message = $('#input-message')
let search_user = $('#search-user')
let search_form = $('#get-user')
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

socket.onopen = async function(e){

    console.log('open', e)
    send_message_form.on('submit', function (e){

        e.preventDefault()
        let message = input_message.val()
        console.log("message val serarch", search_user.val())
        let send_to = get_active_other_user_id()
        let thread_id = get_active_thread_id()
        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'thread_id': thread_id
        }
        data = JSON.stringify(data)
        socket.send(data)
        $(this)[0].reset()
    })

    search_user.on('submit', function (e){
        e.preventDefault()
        let message = search_user.val()
        console.log(message)
        let send_to = get_active_other_user_id()
        let thread_id = get_active_thread_id()
        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'thread_id': thread_id
        }
        data = JSON.stringify(data)
        socket.send(data)
        $(this)[0].reset()
    })
}

socket.onmessage = async function(e){
    console.log('message', e)
    let data = JSON.parse(e.data)
    let message = data['message']
    let sent_by_id = data['sent_by']
    let thread_id = data['thread_id']
    newMessage(message, sent_by_id, thread_id)
    scrollContent.scrollTo(0,scrollContent.scrollHeight);
}

socket.onerror = async function(e){
    console.log('error', e)
}

socket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id, thread_id) {
	if ($.trim(message) === '') {
		return false;
	}
	let message_element;
	let chat_id = 'chat_' + thread_id
	if( sent_by_id == USER_ID){
	    message_element = `
			<div class="d-flex mb-4 replied">
				<div class="msg_cotainer_send">
					${message}
					<span class="msg_time_send">8:55 AM, Today</span>
				</div>
				<div class="img_cont_msg">
					<img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
				</div>
			</div>
	    `
    }else{
	   message_element = `
           <div class="d-flex mb-4 received">
              <div class="img_cont_msg">
                 <img src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg" class="rounded-circle user_img_msg">
              </div>
              <div class="msg_cotainer">
                 ${message}
              </div>
           </div>
        `

    }
//  <span class="msg_time">8:40 AM, Today</span>


    let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')
    console.log(message_body)
	message_body.append($(message_element))
    message_body.animate({
        scrollTop: $(document).height()
    }, 100);
	input_message.val(null);
}
//const searchInput = document.querySelector('.dialog__search-bar')
//
//searchInput.addEventListener('input', e => {
//  inputValue = e.target.value;
//  dialogList.textContent = ""
//  // if(!inputValue){
//  //     renderUser(usersData)
//  // }
//  console.log("inputValue")
//  let searchResult = usersData.filter(value=>{
//      return value.name.toLowerCase().includes(inputValue)
//  })
//  renderUser(searchResult)
//})


$('.contact-li').on('click', function (){
    $('.contacts .actiive').removeClass('active')
    $(this).addClass('active')

    // message wrappers
    let chat_id = $(this).attr('chat-id')
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