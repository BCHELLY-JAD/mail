document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => {load_mailbox('inbox'); inboxMail()});
  document.querySelector('#sent').addEventListener('click', () => {load_mailbox('sent'); sentMails()});
  document.querySelector('#archived').addEventListener('click', () => {load_mailbox('archive'); archiveMail()});
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.getElementById('compose-form').addEventListener('submit', composeMail);


  // By default, load the inbox
  load_mailbox('inbox');
  inboxMail()
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-mail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {


  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-mail').style.display = 'none';



  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


}


function single_mail() {
  // Show single mail page and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-mail').style.display = 'block';
  }



  //compose a mail and send it via POST request
function composeMail(e) { 
  e.preventDefault();

  const recipients = document.getElementById('compose-recipients').value;
  const subject = document.getElementById('compose-subject').value;
  const body = document.getElementById('compose-body').value;

  fetch('/emails', { 
    method: 'POST',
    body: JSON.stringify({ 
      recipients: recipients,
      subject : subject,
      body : body
    })
  })

  .then(response => response.json())
  .then(result => { 
 
    const errorDisplay = document.getElementById('error');
    if ('error' in result) {
        errorDisplay.innerHTML = result.error;
    } else {
    //Redirect the user to his sent page
    load_mailbox('sent');
    sentMails();
    }
    })
  
  .catch(error => { 
    console.log('Error:', error);
});
}


//Sent Mail Page

function sentMails() {
  fetch('/emails/sent')
  .then(response => response.json())
  .then(emails => {
    emails.forEach(function(send) { 
      
      const div = document.createElement('div');
      if(send.read===true) { 
        div.innerHTML = `<div><ul class="list-group mb-3"><li onclick="multiple2(${send.id})" style="background: #d3d3d3;" class="list-group-item mails">To: ${send.recipients} <span>${send.subject}</span> <span style="color: grey; font-size: 14px;">${send.timestamp}</span></li></ul></div>`
      } else { 
        div.innerHTML = `<div><ul class="list-group mb-3"><li onclick="multiple2(${send.id})" class="list-group-item mails">To: ${send.recipients} <span>${send.subject}</span> <span style="color: grey; font-size: 14px;">${send.timestamp}</span></li></ul></div>`
      }
      document.getElementById('emails-view').append(div);     
    });
  });
  return false
}




// Get the div's id for the inbox
function oneMail(email_id) {
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
     
       // Displaying the details of the mail
    const li = document.createElement('li');
    li.id = 'details'

    if (email.archived===true){ 
      li.innerHTML = `<span class="subject">${email.subject}</span><br><span class="essential"> From:</span><span class="info"> ${email.sender}</span><br><span class="essential"> To:</span><span class="info"> ${email.recipients}</span> <br><span class="essential"> Timestamp:</span><span class="info"> ${email.timestamp}</span><br><span class="essential">Body:</span><span class="info"> ${email.body}</span> <div class="buttons"><button onclick='replyMail(${email.id})' id="reply">Reply</button><button onclick='Unarchive(${email.id})' id="archive">Unarchive</button></div>`;
    } else { 
      li.innerHTML = `<span class="subject">${email.subject}</span><br><span class="essential"> From:</span><span class="info"> ${email.sender}</span><br><span class="essential"> To:</span><span class="info"> ${email.recipients}</span> <br><span class="essential"> Timestamp:</span><span class="info"> ${email.timestamp}</span><br><span class="essential">Body:</span><span class="info"> ${email.body}</span> <div class="buttons"><button onclick='replyMail(${email.id})' id="reply">Reply</button><button onclick='archive(${email.id})' id="archive">Archive</button></div>`;
    }
    document.querySelector('.once').append(li);
    
      });

      document.querySelector('.once').innerHTML = '';
      return false;
};

//Get the div's id for the sentMails 
function oneMailsent(email_id) {
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
     
       // Displaying the details of the mail
    const li = document.createElement('li');
    li.id = 'details'
    li.innerHTML = `<span class="subject">${email.subject}</span><br><span class="essential"> From:</span><span class="info"> ${email.sender}</span><br><span class="essential"> To:</span><span class="info"> ${email.recipients}</span> <br><span class="essential"> Timestamp:</span><span class="info"> ${email.timestamp}</span><br><span class="essential">Body:</span><span class="info"> ${email.body}</span> <div class="buttons"><button onclick="forReply()" id="reply">Reply</button></div>`;
    document.querySelector('.once').append(li);
    
      });

    document.querySelector('.once').innerHTML = '';
    return false;
};



function read(email_id) {  
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true        
    }),
  })
  return false
}


// call oneMail and single_mail functions inside a global function
function multiple(email_id) { 
  single_mail();
  oneMail(email_id);
  read(email_id)
}


function multiple2(email_id) { 
  single_mail();
  oneMailsent(email_id);
  read(email_id)
}


//inbox Mail Page

function inboxMail() { 
  fetch('/emails/inbox')
  .then(response => response.json())
  .then( letterbox => {  
    letterbox.forEach(function(inbox) { 
      
      const div = document.createElement('div');

      if(inbox.read===true) { 
        div.innerHTML =`<ul class="list-group mb-3"><li onclick = multiple(${inbox.id}) style="background: #d3d3d3;" class="list-group-item mails"> <span class="start">${inbox.sender}</span>  <span class="middle"> ${inbox.subject}</span> <span class="end" style="color: grey; font-size: 14px;">${inbox.timestamp}</span></li></ul>`
      } else { 
        div.innerHTML =`<ul  class="list-group mb-3"><li onclick = multiple(${inbox.id})  class="list-group-item mails"> <span class="start">${inbox.sender}</span>  <span class="middle"> ${inbox.subject}</span> <span class="end" style="color: grey; font-size: 14px;">${inbox.timestamp}</span></li></ul>`
      }
      document.getElementById('emails-view').append(div);     
    });
  });
  return false
}


//archive Mail Page

function archiveMail() { 
  fetch('/emails/archive')
  .then(response => response.json())
  .then( archieve => { 
    console.log(archieve) 
    archieve.forEach(function(arch) { 
      const div = document.createElement('div')
      div.innerHTML =`<ul class="list-group mb-3"><li onclick = multiple(${arch.id}) style="background: #d3d3d3;" class="list-group-item mails"> <span class="start">${arch.sender}</span>  <span class="middle"> ${arch.subject}</span> <span class="end" style="color: grey; font-size: 14px;">${arch.timestamp}</span></li></ul>`
      document.getElementById('emails-view').append(div);    
       
    });
  });
  return false
}


// Archive Mails
function archive(email_id) {  
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true        
    }),
  })
  .then(() => {
    inboxMail();
    load_mailbox('inbox');
    })
}



//Unarchive Mails
function Unarchive(email_id) {  
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false        
    }),
  })
  .then(() => {
    inboxMail();
    load_mailbox('inbox');
    })
}


//create a function to reply to an email
function replyMail(email_id){ 
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-mail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block'; 

  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
  document.getElementById('compose-recipients').value = email.sender;
  if(email.subject.substring(0,3)=="Re:"){
    document.querySelector('#compose-subject').value =email.subject;
  }else{
    document.querySelector('#compose-subject').value ="Re: "+ email.subject;
  }
  document.getElementById('compose-subject').setAttribute("readonly",true);
  document.getElementById('compose-recipients').setAttribute("readonly",true);
  document.getElementById('compose-body').value = `\n on ${email.timestamp}, ${email.sender} wrote: ${email.body} \n ...................`;
  })

}















