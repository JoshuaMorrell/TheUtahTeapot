// Logic for site navigation
let tabs = Array.prototype.slice.call(document.getElementsByTagName('li'));
let pages = Array.prototype.slice.call(document.getElementsByClassName('page'));
for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', tabClick(tabs, pages, i), false);
}
function tabClick(t, p, index) {
    return () => {
        for (let i = 0; i < t.length; i++) {
            t[i].className = '';
            p[i].style.display = 'none';
        }
        t[index].className = 'is-active';
        p[index].style.display = 'block';
    };
}