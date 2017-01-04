var socket = io(); //creating a connection
socket.on('connect', function() { //an event listener for the client
  console.log('Connected to server');

});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) { //setting up a custom event called newMessage
  console.log('New Message', message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li); //adding the messages to the odered list with id messages
});

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>'); //_blank opens that new url in a new tab

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});
jQuery('#message-form').on('submit', function (e) { //attaching the submit form to this function
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
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
