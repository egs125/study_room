// 아코디언 메뉴 클릭 이벤트 핸들러
const toggleClickedItem = e => {
    const targetID = e.target.id;
    const targetBody = document.querySelector(`#${targetID}_body`);

    e.target.classList.toggle('collapsed');
    targetBody.classList.toggle('show');
};