const form = document.querySelector('form');


form.addEventListener('submit', (e) => {
  
  e.preventDefault();


  const name = document.querySelector('input[name="name"]');
  const email = document.querySelector('input[name="email"]');
  const phone = document.querySelector('input[name="phone"]');
  const message = document.querySelector('textarea[name="message"]');

  
  if (name.value === '' || email.value === '' || phone.value === '' || message.value === '') {
    alert('Please fill in all the fields.');
  } else {
    alert('Form submitted successfully!');
  }
});