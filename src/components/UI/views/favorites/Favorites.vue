<script setup>
import { ref, onMounted} from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
 
import { db } from '../../../../dixiedb.js';


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
        if (user.favorite){
            response.push(user)
        }
        
     });
       
 
    userList.value =  response ;
     
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
    getUsersFromDb();
    
})
</script>

<template>
<Card>
    <template #title>Kedvencek</template>
   
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
         
        </template>
    </Column>
    
    <template #footer>  {{ userList ? userList.length : 0 }} elem a kedvencek listában </template>
</DataTable>
</template>


<style scoped>
</style>