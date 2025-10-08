const inputSlider=document.querySelector("[data-lengthSlider]")
// to fetch any element using custom attribute we do it using square brackets and attribute name inside it

const lengthDisplay=document.querySelector("[data-lengthNumber]")
const passwordDisplay=document.querySelector("[data-password-display]")
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copy-msg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const numberCheck=document.querySelector("#numbers")
const symbolCheck=document.querySelector("#symbols")
const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generateButton")
const allCheckBox=document.querySelectorAll("input[type=checkbox]")
const symbols='`~!@#$%^&*()+<[>?:]\"{}|,./';


//initial states
let password="";
let passwordLength=10;
let checkCount=0;
// set strength circle color to grey
setIndicator("#ccc");

handleSlider();
// handles the length  of password reflect passed length on screen
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerHTML=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    // this is to calculate the width of the slider so that only the area betwen min nad max gets background color 
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%";
    // we are setting calculated width as backgroundsize width and height of slider as 100%
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 8px 2px ${color}`
}

function getRandomInteger(min,max){
   return  Math.floor(Math.random() * (max-min)) + min; 
    // math.random gets a float value between [0,1) 1 is not inclusive
    // we are multiplying that random num with (min-max) this gets any random float num between zero and (max-min)
    // that random may be a float num so we are converting it into its floor value or say any nearest integer 
    // as we want to get num between min and max we are adding min to get a num between min and max
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return  String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return  String.fromCharCode(getRandomInteger(65,90));
}

function generateSymbol(){
    const random=getRandomInteger(0,symbols.length);
    return symbols.charAt(random);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }

    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }

    else{
        setIndicator("#f00");
    }

}

function shufflePassword(array){
    //Fisher Yates Method for shuffling array
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random() * (i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str="";
    array.forEach((el)=>{
        if(el!=" ")
            str+=el
    });
    return str;
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // this returns a promise which can be resolved or rejected if it doesnt give error it means it is resolved and we are executing line below if it gives error we go to catch block
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    // to make copy span visible
    copyMsg.classList.add("active")

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000);

}

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    })

    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckboxChange);
})

inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener("click",()=>{
// when none of the checkbox are selceted
   if(checkCount==0) return;

   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
   }

//    remove old password
   password=" ";

   let funcArr=[];

   if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase);
   }

   if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase);
   }

   if(numberCheck.checked){
    funcArr.push(generateRandomNumber);
   }

   if(symbolCheck.checked){
    funcArr.push(generateSymbol);
   }

//    compulsory addition
   for(let i=0;i<funcArr.length;i++){
    password+=funcArr[i]();
   }

//    remaining addition
   for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
   }

   // till now we have generated password of passwordLength but according to above steps of this function
    //when we are trying to do compulsory addition we are adding first uppercase,then lowercase ,then number,then symbol that is like fixed
    //but we have to generate a password which can start with any character maybe upper,lower,num or symbol so we shuffle the password after obtaining it to get random order

    //shuffling the password
    password=shufflePassword(Array.from(password));

    // displaying the password
    passwordDisplay.value=password;

    //calculating strength
    calcStrength();
})
 


