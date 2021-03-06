import Cosmic from 'cosmicjs'
import config from '~/config/config'
import async from 'async'
const api = Cosmic()
const bucket = api.bucket({
  slug: config.bucket.slug,
  read_key: config.bucket.read_key,
  write_key: config.bucket.write_key
})

function getGlobals () {
    const params = {
      type_slug: 'globals'
    }
    return bucket.getObjectsByType(params);
}

function getPages () {
  const params = {
    type_slug: 'pages'
  };
  return bucket.getObjectsByType(params);
}

function getBlogs () {
  const params = {
    type_slug: 'blogs'
  };
  return bucket.getObjectsByType(params);
}

function getSearchData(){
  return bucket.getObjects();
}

async function contactForm(data, contact){
  var url = process.env.SENDGRID_ENDPOINT
  var to = process.env.SENDGRID_TO
  var sendgrid_data = {
    to,
    from: `${data.email}`,
    subject: `Contact form submission: ${data.name}`,
    text_body: `This is a plain text version of this message: ${data.message}`,
    html_body: `Name: ${data.name}<br />Email: ${data.email}<br />Phone: ${data.phone}<br />Message: ${data.message}`
  }
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(sendgrid_data),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(response => {
    console.log('Success:', JSON.stringify(response))
    return {
      status: true,
      message: 'Message sent!'
    }
  })
  .catch(error => {
    console.error('Error:', error)
    return {
      error: true,
      message: 'Message NOT sent!'
    }
  })
  return res
}

export default {getGlobals,getPages,getBlogs,getSearchData,contactForm}
