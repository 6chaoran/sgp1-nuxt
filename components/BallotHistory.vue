<template>
    <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-300 table-auto">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Phase
                                    </th>
                                    <th v-for="p in cols" scope="col"
                                        :class='[p == "2A(2)" ? "hidden sm:block" : "", "px-1 py-3.5 text-center text-sm font-semibold text-gray-900"]'>
                                        {{ p.charAt(0).toUpperCase() + p.slice(1) }}</th>
           
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="(school, i) in ballotHistoryFiltered" :key="i">
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 capitalize">
                                        {{ school.phase.replace('Phase ', '') }}</td>
                                    <td v-for="p in cols.filter(x => x!= 'odds')"
                                        :class="[p == '2A(2)' ? 'hidden sm:block' : '', 'whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500']">
                                        {{ school[p] }}</td>
                                    <td 
                                        class="whitespace-nowrap px-3 py-4 text-sm text-center text-gray-500">
                                        {{ isFloatString(school.odds) ? `${(school.odds * 100).toFixed(0)}%` : school.odds }}</td>                                
                                  </tr>
                            </tbody>
                        </table>                    
                </div>
                <div class="mt-6 ml-3">
                    <h2 class="font-semibold text-gray-600 text-sm">Ballot Odds By Year</h2>
                </div>
                <Chart :data="ballotHistoryData" />
            </div>
        </div>
    </div>

</template>

<script setup>

const props = defineProps({
    ballotHistoryData: Object,
    year: String,
})

const cols = ['vacancy','applied', 'taken', 'ballot', 'odds']
const phases = ['Phase 1', '2A','2A(1)', '2A(2)', '2B', '2C', '2C(S)', '3']

function isFloatString(s) {
  const n = Number(s)
  return !isNaN(n) && n >= 0 && n <= 1
}

const formatOdds = (odds) => {
  if (odds) {
    return odds === '' ? '-' : (parseFloat(odds * 100).toFixed(0) + '%')
  } else {
    return '-'
  }
}

const formatBallot = (ballot) => {
  if (ballot) {
    return ballot === '' ? '-' : ballot
  } else {
    return '-'
  }
}

const formatCnt = (count) => {
  if (count) {
    return parseInt(count).toFixed(0)
  } else {
    return '-'
  }
}


const formatRow = (row) => {
  const category = row.category
  
  let newRow = JSON.parse(JSON.stringify(row))
  let phase;
  for (let i = 0; i < cols.length; i++) {
    phase = cols[i]
    if (category === 'odds') {
      newRow[phase] = formatOdds(row[phase])
    } else if (category === 'ballot') {
      newRow[phase] = formatBallot(row[phase])
    } else {
      newRow[phase] = formatCnt(row[phase])
    }
  }

  return newRow
}


const ballotHistoryFiltered = computed(() => {
  const filtered = props.ballotHistoryData[String(props.year)]
  const orderMap = new Map(phases.map((v, i) => [v, i]))
    // const formatted = props.ballotHistoryData.map(formatRow)
    // const filtered = formatted.filter(x => String(x.year) == String(props.year))
    if(filtered == null) {
      return []
    }
    return Object.values(filtered).sort((a, b) => orderMap.get(a.phase) - orderMap.get(b.phase))

})


</script>