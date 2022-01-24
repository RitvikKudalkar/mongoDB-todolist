
module.exports.getDate =  function(){
  let today = new Date();
  let options = {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }
  return today.toLocaleDateString("en-US", options)
}



module.exports.getDay = function getDay(){
  let today = new Date();
  let options = {
    weekday: 'long',
  }
  return today.toLocaleDateString("en-US", options)
}
