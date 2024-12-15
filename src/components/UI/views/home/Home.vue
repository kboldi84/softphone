<script setup>
 
</script>

<template>
    <div class="main">
     
                <div class="dock">
                    
                    <Button label="Kedvencek"  severity="secondary"  icon="pi pi-star-fill" iconPos="top" raised />
                     
                    <Button label="Legutóbbi" severity="warn" icon="pi pi-sort-amount-down" iconPos="top" raised />
               
                    <Button label="Névjegyzék" severity="info" icon="pi pi-address-book" iconPos="top" raised />


                </div>
       
    </div>
      
 
 
</template>
<style scoped>
 
.main{
     

    grid-column:2/3 ;
    grid-row: 2/3;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    min-height: 94vh;
 background: #fff;
}
 
.dock{
    --scale: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}
.dock img{
    height: calc(3rem * var(--scale));
    width: calc(3rem * var(--scale));
    position: relative;
    top: calc(3rem * var(--scale) - 3rem )/2 * -1;
    transition: 250ms all ease-in-out;
}
.dock img.loading{
    animation: 1s loading ease-in infinite;
}
.dock img:hover{
    transform: translateY(-1rem);
    transform:scale(1.8)
}
.vr{
    height: 80%;
    width: 1px;
    background-color: #999;
}
</style>