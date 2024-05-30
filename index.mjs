import fetch from 'node-fetch'
const url = 'https://api.quackquack.games/'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMxODYwOCwidGltZXN0YW1wIjoxNzE2OTg5NTEzNDc1LCJ0eXBlIjoxLCJpYXQiOjE3MTY5ODk1MTMsImV4cCI6MTcxNzU5NDMxM30.55trl_r-6QJlyYxHPIgfOjeTwRbtnubH4aQFYwJ7oJc'


// https://api.quackquack.games/balance/get
// https://api.quackquack.games/payment/list

async function fetchAPI(router, method,body) {
  try {
    const response = await fetch(`${url}${router}`, {
        method: method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
  } catch (error) {
      console.error('Error');
  }
}

// balance get 
async function getBalance() {
  const res = await(fetchAPI('balance/get', 'GET'))
  if (res) {
    const { data } = res.data
    const nest = data.find(d => d.symbol === 'EGG')
    if (nest ) console.log('Total Egg ===============================', Math.round(nest.balance))
  }
}

// getListReload
async function getListReload() {
  console.log('=============================Start==================================')
  const res = await(fetchAPI('nest/list-reload', 'GET'))
  if (res) {
    const { nest, duck } = res.data
    if (nest) {
      nest.map((n, i) => {
        if (n.status === 2) {
          collectEgg(n.id)
        } else {
          layEgg(n.id, duck[i])
        }
      })
    }
  }
}
// https://api.quackquack.games/golden-duck/reward
// collect eggs 896738 896736
async function reward() {
  const res = await fetchAPI('golden-duck/reward', 'GET')
  if (res) {
    console.log('Reward Success!')
  }
}

// collect eggs 896738 896736
async function collectEgg(nestId) {
  const res = await fetchAPI('nest/collect', 'POST',{nest_id: nestId})
  if (res) {
    console.log('Collect Egg Successfully!', nestId)
  }
}
// lay Egg
async function layEgg(nestId, duck) {
    const res = await fetchAPI('nest/lay-egg', 'POST',{nest_id: nestId,
      duck_id: duck.id})
    if (res) {
      console.log('LayEgg Egg Successfully!', nestId)
    }
}


function main() {
  setInterval(() => {
    getListReload()
    reward()
    getBalance()
  }, 1000)
}

main()