export function copyToClipboard(str: string) {
  if (window.navigator.clipboard) {
    return window.navigator.clipboard.writeText(str);
  }

  return new Promise(resolve => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('Copy');
    setTimeout(() => {
      document.body.removeChild(el);
      resolve(null);
    }, 0);
  });
}
