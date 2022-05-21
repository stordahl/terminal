<script lang=ts context=module>
   import type { Load } from '@sveltejs/kit';
   import { parseData } from '../lib/utils';
   
   /** @type {import('@sveltejs/kit').Load} */
   export const load: Load = async ({ url, params, props, fetch, session, stuff, status, error }) => {
     const resourceUrl = `https://o7q4ayag.api.sanity.io/v2021-06-07/data/query/production?query=*[]|%20order(_type)`;
     const res = await fetch(resourceUrl);
     const { result } = await res.json()
   
     if (res.ok) {
       return {
         status: res.status,
         props: {
            data: parseData(result)
         }
       };
     }
   
     return {
       status: res.status,
       error: new Error(`Could not load url`)
     };
   }
</script>
<script lang=ts>
  import './base.css'
  import { browser } from '$app/env'
  import { toHTML } from '@portabletext/to-html'

  export let data:any
  console.log(
    toHTML(data.posts[0].body)
    // data.posts
  )
  // $:console.log(data)

  let input:HTMLTextAreaElement
  let inputValue:string
  let cliIsFocused

  const historySpacer:string = `<br>`
  const prompt:string = `
    <span id="prompt">
      <span class="blue">guest</span>
      <span class="yellow">@</span>
      <span class="green">term.stordahl.dev</span>
      <span class="yellow">:~$ </span>
    </span>`

  const banner:string = `<pre>
    
▄▄▄█████▓▓█████  ▄████▄   ██░ ██     █     █░ ▒█████   ███▄    █ ▄▄▄█████▓
▓  ██▒ ▓▒▓█   ▀ ▒██▀ ▀█  ▓██░ ██▒   ▓█░ █ ░█░▒██▒  ██▒ ██ ▀█   █ ▓  ██▒ ▓▒
▒ ▓██░ ▒░▒███   ▒▓█    ▄ ▒██▀▀██░   ▒█░ █ ░█ ▒██░  ██▒▓██  ▀█ ██▒▒ ▓██░ ▒░
░ ▓██▓ ░ ▒▓█  ▄ ▒▓▓▄ ▄██▒░▓█ ░██    ░█░ █ ░█ ▒██   ██░▓██▒  ▐▌██▒░ ▓██▓ ░ 
  ▒██▒ ░ ░▒████▒▒ ▓███▀ ░░▓█▒░██▓   ░░██▒██▓ ░ ████▓▒░▒██░   ▓██░  ▒██▒ ░ 
  ▒ ░░   ░░ ▒░ ░░ ░▒ ▒  ░ ▒ ░░▒░▒   ░ ▓░▒ ▒  ░ ▒░▒░▒░ ░ ▒░   ▒ ▒   ▒ ░░   
    ░     ░ ░  ░  ░  ▒    ▒ ░▒░ ░     ▒ ░ ░    ░ ▒ ▒░ ░ ░░   ░ ▒░    ░    
  ░         ░   ░         ░  ░░ ░     ░   ░  ░ ░ ░ ▒     ░   ░ ░   ░      
            ░  ░░ ░       ░  ░  ░       ░        ░ ░           ░          
                ░                                                         
  ██████  ▄▄▄    ██▒   █▓▓█████     █    ██   ██████                      
▒██    ▒ ▒████▄ ▓██░   █▒▓█   ▀     ██  ▓██▒▒██    ▒                      
░ ▓██▄   ▒██  ▀█▄▓██  █▒░▒███      ▓██  ▒██░░ ▓██▄                        
  ▒   ██▒░██▄▄▄▄██▒██ █░░▒▓█  ▄    ▓▓█  ░██░  ▒   ██▒                     
▒██████▒▒ ▓█   ▓██▒▒▀█░  ░▒████▒   ▒▒█████▓ ▒██████▒▒                     
▒ ▒▓▒ ▒ ░ ▒▒   ▓▒█░░ ▐░  ░░ ▒░ ░   ░▒▓▒ ▒ ▒ ▒ ▒▓▒ ▒ ░                     
░ ░▒  ░ ░  ▒   ▒▒ ░░ ░░   ░ ░  ░   ░░▒░ ░ ░ ░ ░▒  ░ ░                     
░  ░  ░    ░   ▒     ░░     ░       ░░░ ░ ░ ░  ░  ░                       
      ░        ░  ░   ░     ░  ░      ░           ░                       
                     ░                                                    
</pre>`

  const keys = [
    `<p>banner</p>`,  
    `<p>clear</p>`,
    `<p>help</p>`,
    `<p>social</p>`,
    `<p>whois</p>`,
  ]

  let history:Array<string> = [banner]

  const handleCommand = (cmd:string) => {
    inputValue = ''
    switch (cmd.toLowerCase()){
      case 'help':
        history = [...history, ...keys, historySpacer]
        break;
      case 'clear':
        history = []
        break;
      case 'whois':
        history = [...history, ...data.whois.text, historySpacer]
        break;
      case 'banner':
        history = [ ...history, banner, historySpacer]
        break;
      case 'social':
        history = [...history, ...data.social.text, historySpacer]
        break;
      default:
        history = [...history, '<p class="red">Unknown Command</p>', historySpacer]
    }
    input.scrollIntoView()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if(document.activeElement !== input){
      input.focus()
    } else {
      if(e.code === 'Enter'){
        e.preventDefault()
        handleCommand(inputValue)
      }
      if(e.metaKey && e.key === 'k'){
        history = []
      }
    }
  }

  $: if(browser) requestAnimationFrame(() => window.scrollTo(0,100000)), history
</script>
<svelte:window on:keydown={handleKeyDown} on:click={() => input.focus()}/>
<div id="term">
  <div id="history">
    <p class="blue">Run <strong>help</strong> to see available commands</p>
    {#each history as h}
        {@html h}
    {/each}
  </div>
  <div id="cmd-line">
    <span>{@html prompt}</span>
    <textarea
      autofocus
      bind:this={input}
      bind:value={inputValue}
      on:focus={() => cliIsFocused = true}
      on:blur={() => cliIsFocused = false}
      name="commandline" 
      id="commandline" 
      cols="30" 
      rows="1"></textarea>
  </div>
</div>
