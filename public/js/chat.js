var socket = io(); //creating a connection

function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight); //scrollTop is a jQuery function that autoscrolls
  }
}
socket.on('connect', function() { //an event listener for the client
  var params = jQuery.deparam(window.location.search); //using global to put the values from the inputs into an object
  socket.emit('join', params, function (error) {
    if (error) {
      alert(error);
      window.location.href = '/'; //if there is an error like an text field isn't filled out then it will take back to main page
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) { //updating the list on the sidebar
  var ol = jQuery('<ol></ol>');
  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

socket.on('newMessage', function(message) { //setting up a custom event called newMessage

  var formattedTime = moment(message.createdAt).format('h:mm a'); //using moment to format the time
  var template = jQuery('#message-template').html(); //getting the inner html
  var html = Mustache.render(template, { //using mustache to add objects to the template
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
  // var formattedTime = moment(message.createdAt).format('h:mm a'); //these four lines are the old way of doing the same thing above but without mustache
  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  //
  // jQuery('#messages').append(li); //adding the messages to the odered list with id messages
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html(); //getting the inner html back
  var html = Mustache.render(template, { //storing the return value
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My Current Location</a>'); //_blank opens that new url in a new tab
  //
  // li.text(`${message.from} ${formattedTime}:`);
  // a.attr('href', message.url);
  // li.append(a);
  jQuery('#messages').append(html);
  scrollToBottom();
});
jQuery('#message-form').on('submit', function (e) { //attaching the submit form to this function
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextBox.val() //getting the value in the text field
  }, function () {
    messageTextBox.val(''); //setting the text field to be empty once the message is sent
  });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location..'); //setting the disabled attribute to disbaled, rendering the send location button useless for a small duration when it's pressed
  navigator.geolocation.getCurrentPosition(function (position) { //using the location api
    locationButton.removeAttr('disabled').text('Send location'); //re-enable the button after a period of time and setting the text back to send location
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude, //get keys from the developer tools
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.')
  });
});
