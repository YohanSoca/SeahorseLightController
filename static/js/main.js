window.onload = init;

function init() {

 
  
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
    const all_lighst_title = document.getElementById('all-lights-title');

    let all_lights_flag = false

    

    flybridge_on.addEventListener('click', function() {
        try {
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
        } catch(e) {
          return
        }
    })

    flybridge_off.addEventListener('click', function() {
        try {
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
        } catch(e) {
          return
        }
    })

    courtesy_on.addEventListener('click', function() {
        try {
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
        } catch(e) {

        }
    })

    courtesy_off.addEventListener('click', function() {
        try {
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
        } catch(e) {

        }
    })

    ladder_on.addEventListener('click', function() {
      try {
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
      } catch(e) {

      }
    })

    ladder_off.addEventListener('click', function() {
    try {
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
    } catch(e) {

    }
    })

    anchor_area_on.addEventListener('click', function() {
     try {
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
     } catch(e) {
       
     }
    })

    anchor_area_off.addEventListener('click', function() {
      try {
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
      } catch(e) {
        
      }
      })

    all_on.addEventListener('click', async function() {
        const btns = [flybridge_on, courtesy_on, ladder_on, anchor_area_on];
        if(!all_lights_flag) {
          all_lights_flag = true;
          all_lighst_title.textContent ='All Lights On';
          while(lightStatus.toString() !== '1,1,1,1') {
            for(let btn of btns) {
              all_lighst_title.style.color = 'red';
              try {
                await new Promise(r => setTimeout(r, 200));
                btn.click();
              } catch(e) {
                alert('all on failed')
              } finally {
                all_lights_flag = false
              }
              all_lighst_title.style.color = 'white';
              await new Promise(r => setTimeout(r, 200));
            }
          }
          all_lighst_title.textContent = 'ALL Lights';
          all_lights_flag = false
        }
    });  

    all_off.addEventListener('click', async function() {
      const btns = [flybridge_off, courtesy_off, ladder_off, anchor_area_off];
      if(!all_lights_flag) {
        all_lights_flag = true;
        all_lighst_title.textContent = 'All Lights Off'
        while(lightStatus.toString() !== '0,0,0,0') {
          for(let btn of btns) {
            all_lighst_title.style.color = 'red';
            try {
              await new Promise(r => setTimeout(r, 200));
              btn.click();
            } catch(e) {
              break
            } finally {
              all_lights_flag = false
            }
            all_lighst_title.style.color = 'white';
            await new Promise(r => setTimeout(r, 200));
          }
        }
        all_lighst_title.textContent = 'ALL Lights';
        all_lights_flag = false;
      }
  });
    setInterval(function() {
      let status_received = false;
      setTimeout(function() {
          if(!status_received) {
            document.getElementById('system-status').textContent = 'Connection Lost';
          }
      }, 3000)
      fetch('get_system_state')
      .then(response => response.json())
      .then(data => {
        document.getElementById('system-status').textContent = '';
        status_received = true;
      }).catch(erro => {
        document.getElementById('system-status').textContent = 'Connection Lost';
      });
    }, 100);

    setInterval(function() {
      fetch('get_lights_state')
      .then(response => response.json())
      .then(data => {
        lightStatus = data['lightStatus'];
        uptate_lights();
      }).catch(error => {
        
      });
    }, 600);

    function uptate_lights() {
     let flybridge_status = document.getElementById('flybridge_status');
     let courtesy_status = document.getElementById('courtesy_status');
     let ladder_status = document.getElementById('ladder_status');
     let anchor_area_status = document.getElementById('anchor_area_status');
     
     flybridge_status.style.backgroundColor = lightStatus[0] === 0 ? '#607d8b' : 'lightblue';
     courtesy_status.style.backgroundColor = lightStatus[1] === 0 ? '#607d8b' : 'lightblue';
     ladder_status.style.backgroundColor = lightStatus[2] === 0 ? '#607d8b' : 'lightblue';
     anchor_area_status.style.backgroundColor = lightStatus[3] === 0 ? '#607d8b' : 'lightblue';
    }
}