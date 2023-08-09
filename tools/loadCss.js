export default class LoadCSS{

constructor(){}

load(url) {
    return new Promise((resolve, reject) => {
      let link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.onload = function() { resolve(); };
      link.href = url;
  
      let headScript = document.querySelector('script');
      headScript.parentNode.insertBefore(link, headScript);
    })
  }
}