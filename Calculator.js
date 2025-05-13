function playClick() {
    const clickSound = document.getElementById("clickSound");
    if(clickSound){
        clickSound.currentTime =0;
        clickSound.play().catch(err =>{
            console.log('Audio play failed:', err);
        });
    }
}

