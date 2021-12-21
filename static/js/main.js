window.onload = init;

function init() {

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
    let lightStatus = [0, 0, 0, 0]
    const flybridge_on = document.getElementById('flybridge_on');
    const flybridge_off = document.getElementById('flybridge_off');
    const courtesy_on = document.getElementById('courtesy_on');
    const courtesy_off = document.getElementById('courtesy_off');
    const flybridge_status = document.getElementById('flybridge_status');
    const courtesy_status = document.getElementById('courtesy_status');
    const ladder_on = document.getElementById('ladder_on');
    const ladder_off = document.getElementById('ladder_off');
    const anchor_area_on = document.getElementById('anchor_area_on');
    const anchor_area_off = document.getElementById('anchor_area_off');
    const all_on = document.getElementById('all_on');
    const all_off = document.getElementById('all_off');

    

    flybridge_on.addEventListener('click', function() {
        (async () => {
            const rawResponse = await fetch('change_light_state', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'light': '0','status': '1'})
            });
            const content = await rawResponse.json();
          })();
    })

    flybridge_off.addEventListener('click', function() {
        (async () => {
            const rawResponse = await fetch('change_light_state', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'light': '0','status': '0'})
            });
            const content = await rawResponse.json();
          })();
    })

    courtesy_on.addEventListener('click', function() {
        (async () => {
            const rawResponse = await fetch('change_light_state', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'light': '1','status': '1'})
            });
            const content = await rawResponse.json();
          })();
    })

    courtesy_off.addEventListener('click', function() {
        (async () => {
            const rawResponse = await fetch('change_light_state', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'light': '1','status': '0'})
            });
            const content = await rawResponse.json();
          })();
    })

    ladder_on.addEventListener('click', function() {
      (async () => {
          const rawResponse = await fetch('change_light_state', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({'light': '2','status': '1'})
          });
          const content = await rawResponse.json();
        })();
    })

    ladder_off.addEventListener('click', function() {
    (async () => {
        const rawResponse = await fetch('change_light_state', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'light': '2','status': '0'})
        });
        const content = await rawResponse.json();
      })();
    })

    anchor_area_on.addEventListener('click', function() {
      (async () => {
          const rawResponse = await fetch('change_light_state', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({'light': '3','status': '1'})
          });
          const content = await rawResponse.json();
        })();
    })

    anchor_area_off.addEventListener('click', function() {
      (async () => {
          const rawResponse = await fetch('change_light_state', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({'light': '3','status': '0'})
          });
          const content = await rawResponse.json();
        })();
      })

    all_on.addEventListener('click', async function() {
        const btns = [flybridge_on, courtesy_on, ladder_on, anchor_area_on];
        for(let btn of btns) {
          await new Promise(r => setTimeout(r, 500));
          btn.click(); 
        }
    });  

    all_off.addEventListener('click', async function() {
      const btns = [flybridge_off, courtesy_off, ladder_off, anchor_area_off];
      for(let btn of btns) {
        await new Promise(r => setTimeout(r, 250));
        btn.click(); 
      }
  });

    setInterval(function() {
        (async () => {
            const rawResponse = await fetch('get_lights_state', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'lightStatus': 'all'})
            });
            const content = await rawResponse.json();
            lightStatus = content['lightStatus'];
            console.log(lightStatus);
            uptate_lights();
          })();
    }, 500);

    function uptate_lights() {
     let flybridge_status = document.getElementById('flybridge_status');
     let courtesy_status = document.getElementById('courtesy_status');
     let ladder_status = document.getElementById('ladder_status');
     let anchor_area_status = document.getElementById('anchor_area_status');
     
     flybridge_status.style.backgroundColor = lightStatus[0] === 0 ? 'red' : 'green';
     courtesy_status.style.backgroundColor = lightStatus[1] === 0 ? 'red' : 'green';
     ladder_status.style.backgroundColor = lightStatus[2] === 0 ? 'red' : 'green';
     anchor_area_status.style.backgroundColor = lightStatus[3] === 0 ? 'red' : 'green';
    }
}