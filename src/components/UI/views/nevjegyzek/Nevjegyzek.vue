<script setup>
import { ref, onMounted} from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from "primevue/usetoast";
import { db } from '../../../../dixiedb.js';
 

const toast = useToast();
const visible = ref(false);
const userList = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    //nev: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    
});

const getUsersFromDb = async ()=>{
  try {
    const response = []
    await db.users.each(user => {
        //console.log(user)
        response.push(user)
     });
       
    /*const response = await fetch('http://localhost:5000/api/users');
    userList.value = await response.json();*/
    userList.value =  response ;
     
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
    getUsersFromDb();
})

const makeCall = (id)=>{
    console.log("make call to id: " + id);
    toast.add({ severity: 'success', summary: 'Hívás indítása...', detail: `${id} hívásának megkezdése`, life: 3000 });

    /* 
    1: meg kell hívni az App.vue-ban az invitert, ki kell építeni a hívást
    2: fel kell nyitni a call ablakot, event a node processnek
    */
    // hívás indítás event küldése node process felé
    window.callHandlers.makeCall(id);
}
const addToFavorites = async (id) => {

        db.users.update(id, {
        "favorite": true
        });

}

const removeFromFavorites = async (id) => {
        db.users.update(id, {"favorite": false });
}

 

</script>

<template>
 <Toast />
<Card>
    <template #title>Névjegyzék</template>
   
</Card>
<DataTable v-model:filters="filters" :value="userList"  size="normal" paginator :rows="5" 
:globalFilterFields="['nev','email', 'tasz']"
:rowsPerPageOptions="[10, 20, 50]" tableStyle="min-width: 40rem">
<template #header>
                <div class="flex justify-end">
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="" />
                    </IconField>
                </div>
            </template>
    <Column field="nev" header="Név"></Column>
    <Column field="email" header="Email"> </Column>
    <Column field="tasz" header="Tasz"></Column>
    <Column field="rovidszam" header="Rovidszam"></Column>
    <Column field="id" header="">
        <template #body="slotProps">
          
           <Button icon="pi pi-phone" severity="success"   @click="makeCall(slotProps.data.tasz)" variant="text" raised rounded aria-label="Phone"   />
           <Button v-if="!slotProps.data.favorite" icon="pi pi-star" severity="primary" style="margin-left:30px"   @click="addToFavorites(slotProps.data.id)" variant="text" raised rounded aria-label="Phone"   />
           
            <Button v-if="slotProps.data.favorite" icon="pi pi-star"  style="margin-left:30px" @click="removeFromFavorites(slotProps.data.id)" severity="info" raised rounded  aria-label="Star" />


        </template>
    </Column>
    
    <template #footer>  {{ userList ? userList.length : 0 }} elem a személyek listában </template>
</DataTable>
</template>


<style >
</style>