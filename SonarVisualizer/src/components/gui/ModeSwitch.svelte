<script>
    import {darkModeSwitch} from "../../data/stores";
    export let darkMode = false;
     async function toggleMode() {;
        darkMode = !darkMode;
        const mainElement = document.querySelector('main');

        if(darkMode) {
            mainElement.classList.add('dark-mode');
            $darkModeSwitch.isDark = true;
        }
        else {
            mainElement.classList.remove('dark-mode');
            $darkModeSwitch.isDark = false;
        }
   }

</script>

        <input type="checkbox" id="darkmode-toggle" on:change={toggleMode}> 
        <label for="darkmode-toggle">
            <img class="sun" src="lightmode.png" alt="lightmode">
            <img class="moon" src="darkmode.png" alt="darkmode">
        </label>
        
      <style>

     label {
        width: 80px;
        height: 30px;
        position: relative;
        display: block;
        background: #D9D9D9;
        border-radius: 20px;
        box-shadow: inset 0px 0px 28px 0px rgba(0,0,0,0.22);
        cursor: pointer;
        margin-bottom: 10PX;
     }
     
     label::after{
        content: "";
        width: 26px;
        height: 26px;
        top: 2px;
        left: 2px;
        position: absolute;
        background: #007AFF;
        border-radius: 30px;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
        transition: 0.2s;
    }

    input {
        width: 0;
        height: 0;
        visibility: hidden;
    }

    input:checked + label {
        background: #474646;
        box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);

    }

    input:checked + label::after {
        left: 78px;
        transform: translateX(-100%);
    }
    
    label .moon{
        margin-left: 28px ;
        width: 20px;
        opacity: 0.7;
    }
    label .sun{
        margin-left: 5px;
        margin-top: 5px;
        width: 20px;
        opacity: 0.8;

    }

    </style>