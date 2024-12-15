<script setup>
import { ref, onMounted} from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
 
import { db } from '../../../../dixiedb.js';

const logsAll = ref([])
const createdCalls = ref([])
const receivedCalls = ref([])
const missedCalls = ref([])

const tabsAllCalls = ref([]);
const tabsReceivedCalls = ref([]);
const tabsCreatedCalls = ref([]);
const tabsMissedCalls = ref([]);


const getCallLogs = async ()=>{
  try {
    const response = []
    await db.callList.each(log => {
            response.push(log)
     });
    logsAll.value =  response ;
   
     
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
    getCallLogs().then(()=>{
        
        missedCalls.value = logsAll.value.filter( item => item.peer_connection_state_cancel == 1 && item.peer_connection_state_accept == 0 );
        createdCalls.value = logsAll.value.filter( item => item.call_type == "created" );
        let i = 0    
        
        logsAll.value.map((item)=>{
            ++i
            if (item.call_type == 'received'){
                tabsReceivedCalls.value.push({ 
                title: `${item.peer_connections_remote} / ${item.call_interval_start}`, 
                content: `vége:  ${item.call_interval_end}` , 
                value: i 
                });
            }
                
        })
        i = 0    
        
        missedCalls.value.map((item)=>{
            ++i
                 tabsMissedCalls.value.push({ 
                title: `${item.peer_connections_remote} / ${item.call_interval_start}`, 
                content: `vége:  ${item.call_interval_end}` , 
                value: i 
                });
             
                
        })
    });
 
    
})
</script>

<template>
      <div class="card">
        <Tabs value="0">
            <TabList>
                <Tab value="0"><i style="margin-right:10px" class="pi pi-sign-in"></i>Fogadott hívás</Tab>
                <Tab value="1"><i style="margin-right:10px" class="pi pi-sign-out"></i>Kimenő hívás</Tab>
                <Tab value="2"><i style="margin-right:10px;transform: rotate(145deg)" class="pi pi-reply"></i> Nem fogadott hívás</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    
        <Accordion value="0">
            <AccordionPanel v-for="tab in tabsReceivedCalls" :key="tab.title" :value="tab.value">
                <AccordionHeader>{{ tab.title }}</AccordionHeader>
                <AccordionContent>
                    <p class="m-0">{{ tab.content }}</p>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
     
                </TabPanel>
                <TabPanel value="1">
                      
                            <Accordion value="0">
            <AccordionPanel v-for="tab in tabsCreatedCalls" :key="tab.title" :value="tab.value">
                <AccordionHeader>{{ tab.title }}</AccordionHeader>
                <AccordionContent>
                    <p class="m-0">{{ tab.content }}</p>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
                     
                </TabPanel>
                <TabPanel value="2">
                         <Accordion value="0">
            <AccordionPanel v-for="tab in tabsMissedCalls" :key="tab.title" :value="tab.value">
                <AccordionHeader>{{ tab.title }}</AccordionHeader>
                <AccordionContent>
                    <p class="m-0">{{ tab.content }}</p>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>
<style scoped>

</style>