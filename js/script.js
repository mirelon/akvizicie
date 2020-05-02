import { words } from './words.js'
$(function(){
    for (const word of words().sort(() => Math.random() - 0.5).slice(0, 10)) {
        const item = $(`<tr><td>${word}</td></tr>`);
        for (let i = 0; i < 3; i++) {
            const radio = $(`<td><input type="radio" id="${word}_1" name="${word}" value="1" /></td>`);
            item.append(radio);
        }
        const button = $(`<button id="${word}_zrus" class="zrus">X</button>`);
        button.click(function (event) {
            event.preventDefault();
            item.find('input').prop('checked', false);
            // item.fadeOut();
        });
        item.append(button);
        $('table').append(item);
    }
})