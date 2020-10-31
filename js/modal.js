const simpleModal = document.getElementById('simple-modal');
const closeButton = document.querySelector('.closeBtn');
const understandButton = document.querySelector('.understand-button');

closeButton.addEventListener('click', () => {
    simpleModal.style.display = 'none';
});

understandButton.addEventListener('click', () => {
    simpleModal.style.display = 'none';
})
