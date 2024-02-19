"use strict";(self.webpackChunkosdcwebapp=self.webpackChunkosdcwebapp||[]).push([[119],{8119:(K,A,a)=>{a.r(A),a.d(A,{AuthModule:()=>B});var u=a(6814),n=a(95),m=a(7659),d=a(3352),c=a(4154),e=a(5879),w=a(4221),v=a(3652),y=a(9325),_=a(5333),b=a(8615);let x=(()=>{var t;class s{constructor(o){this.store=o,this.errorMessage$=this.store.select(c.H9.N3)}toggleErrorModal(){this.store.dispatch(d.nK.toggleErrorModal()),this.store.dispatch(d.nK.addErrorMessage({errorMessage:""}))}}return(t=s).\u0275fac=function(o){return new(o||t)(e.Y36(w.yh))},t.\u0275cmp=e.Xpm({type:t,selectors:[["shared-error-modal"]],decls:13,vars:3,consts:[["tabindex","-1",1,"fixed","top-0","left-0","right-0","bottom-0","z-50","p-4","overflow-x-hidden","overflow-y-auto","flex","items-center","justify-center"],[1,"relative","w-full","max-w-md","max-h-full"],[1,"relative","bg-white","rounded-xl","shadow"],[1,"p-6","text-center","h-80","flex","flex-col","items-center","justify-center"],[1,"mx-auto","bg-red","rounded-full","flex","items-center","justify-center","w-20","h-20","mb-5"],[1,"fa-solid","fa-xmark","text-white","text-5xl"],[1,"text-xl","text-red","font-bold"],[1,"mb-5","font-normal"],["type","button",1,"focus:outline-none","text-white","text-base","bg-red","hover:bg-lightred","font-medium","rounded-xl","px-10","py-1.5","mt-2","mx-auto","block","popup-button",3,"click"]],template:function(o,r){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4),e._UZ(5,"i",5),e.qZA(),e.TgZ(6,"h3",6),e._uU(7,"Mensaje de error"),e.qZA(),e.TgZ(8,"p",7),e._uU(9),e.ALo(10,"async"),e.qZA(),e.TgZ(11,"button",8),e.NdJ("click",function(){return r.toggleErrorModal()}),e._uU(12,"Cerrar"),e.qZA()()()()()),2&o&&(e.xp6(9),e.Oqu(e.lcZ(10,1,r.errorMessage$)))},dependencies:[u.Ov]}),s})();var T=a(5347);function k(t,s){if(1&t&&(e.TgZ(0,"p",8),e._uU(1),e.qZA()),2&t){const i=e.oxw();e.xp6(1),e.hij(" ",i.getFieldError(i.fieldName)," ")}}function N(t,s){1&t&&(e.TgZ(0,"p",9),e._uU(1,"\xa0"),e.qZA())}const E=function(t,s){return{"fa-eye":t,"fa-eye-slash":s}};let S=(()=>{var t;class s{constructor(o){this.validationsService=o,this.fieldName="password",this.name="Password",this.label="Contrase\xf1a",this.showPassword=!1,this.inputPasswordType="password"}togglePasswordVisibility(){this.showPassword=!this.showPassword,this.inputPasswordType=this.showPassword?"text":"password"}isValidField(o){return this.validationsService.isValidField(this.formGroup,o)}getFieldError(o){return this.validationsService.getFieldError(this.formGroup,o)}}return(t=s).\u0275fac=function(o){return new(o||t)(e.Y36(v.k))},t.\u0275cmp=e.Xpm({type:t,selectors:[["auth-input-password"]],inputs:{fieldName:"fieldName",formGroup:"formGroup",name:"name",label:"label"},decls:10,vars:12,consts:[[1,"relative","w-full","my-1",3,"formGroup"],[1,"bg-white-lightbone","absolute","top-[-15px]","left-6","p-1"],["for","",1,"text-darkgray"],[1,"placeholder:text-darkgray","block","bg-white-lightbone","border-solid","border-2","border-ligthgray","w-full","rounded-lg","p-2","pl-9","pr-3","h-12","shadow-sm","focus:outline-none","focus:ring","focus:lightblue-cyan",3,"formControlName","name","id","type"],["type","button",1,"absolute","top-1","right-2","mt-2","mr-2","pt-0.5","rounded-full","text-gray-500","hover:text-blue-500",3,"click"],["aria-hidden","true",1,"fa","text-darkgray",3,"ngClass"],["class","mt-2 text-sm text-red",4,"ngIf","ngIfElse"],["hidden",""],[1,"mt-2","text-sm","text-red"],[1,"mt-2","text-sm"]],template:function(o,r){if(1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"label",2),e._uU(3),e.qZA()(),e._UZ(4,"input",3),e.TgZ(5,"button",4),e.NdJ("click",function(){return r.togglePasswordVisibility()}),e._UZ(6,"i",5),e.qZA(),e.YNc(7,k,2,1,"p",6),e.YNc(8,N,2,0,"ng-template",null,7,e.W1O),e.qZA()),2&o){const l=e.MAs(9);e.Q6J("formGroup",r.formGroup),e.xp6(3),e.Oqu(r.label),e.xp6(1),e.Q6J("formControlName",r.fieldName)("name",r.fieldName)("id",r.fieldName)("type",r.inputPasswordType),e.xp6(2),e.Q6J("ngClass",e.WLB(9,E,r.showPassword,!r.showPassword)),e.xp6(1),e.Q6J("ngIf",r.isValidField(r.fieldName))("ngIfElse",l)}},dependencies:[u.mk,u.O5,n.Fj,n.JJ,n.JL,n.sg,n.u]}),s})();function P(t,s){1&t&&e._UZ(0,"shared-error-modal")}let I=(()=>{var t;class s{constructor(o,r,l,p,h,f,g){this.formBuilder=o,this.store=r,this.validationsService=l,this.eventFactoryService=p,this.websocketService=h,this.securityEventService=f,this.router=g,this.errorModalOpen$=this.store.select(c.H9.ZI),this.errorMessage$=this.store.select(c.H9.N3),this.loginForm=this.createLoginForm()}ngOnInit(){setTimeout(()=>{this.store.dispatch(d.Nd.hideAll())},0)}ngOnDestroy(){setTimeout(()=>{this.store.dispatch(d.Nd.showAll())},0)}onSubmit(){this.loginForm.invalid?this.loginForm.markAllAsTouched():this.securityEventService.userLogin(this.loginForm.value)}createLoginForm(){return this.formBuilder.group({email:["",[n.kI.required,this.validationsService.isValidEmail],[]],password:["",[n.kI.required,this.validationsService.isValidPassword,n.kI.minLength(6)],[]]})}}return(t=s).\u0275fac=function(o){return new(o||t)(e.Y36(n.qu),e.Y36(w.yh),e.Y36(v.k),e.Y36(y.Q),e.Y36(_.i),e.Y36(b.Z),e.Y36(m.F0))},t.\u0275cmp=e.Xpm({type:t,selectors:[["auth-login"]],decls:27,vars:7,consts:function(){let i,o;return i=$localize`:@@login: Acceso a tu cuenta `,o=$localize`:@@signin: Iniciar sesión `,[[1,"flex","flex-grow","h-full"],[1,"flex-1","flex","justify-center","items-center"],[1,"relative","w-full","xl:w-full","md:w-11/12","h-full","rounded-l-3xl","rounded-r-8xl","bg-white-lightbone","md:bg-darkblue-cyan","drop-shadow-2xl","max-w-screen-lg","max-h-[800px]"],[4,"ngIf"],[1,""],[1,"flex","flex-col","justify-center","items-center","w-full","h-full","gap-12","mt-10","md:mt-o"],[1,"text-center","text-4xl","text-yellow-500","font-bold","mb-10"],i,["autocomplete","off",1,"flex","flex-col","items-center","justify-center","h-4/5","w-full","md:w-4/5","px-2","pb-20","2xl:px-10","gap-6",3,"formGroup","ngSubmit"],["fieldName","email","label","Email","inputType","email",1,"w-full",3,"formGroup","bgColor"],[1,"w-full",3,"formGroup"],[1,"w-full","flex","justify-end"],["routerLink","/auth/forgot-password",1,"cursor-pointer","underline","decoration-1","text-blue","text-sm"],["type","submit","routerLink","/home/files",1,"w-full","h-14","bg-yellow-500","text-white","text-lg","p-2","rounded-lg","font-bold","hover:bg-hover-darkblue"],o,[1,"flex-1","flex","justify-center","items-center","bg-darkslategray"],[1,"flex","flex-col","w-96","space-y-5","items-center"],["src","/./assets/img/OSD.png","alt","Logo OSD",1,"w-44"],["type","submit","routerLink","/onboarding/onboarding-register-claimant",1,"w-full","h-14","bg-yellow-500","text-white","text-lg","p-2","rounded-lg","font-bold","hover:bg-hover-darkblue"],[1,"w-full","flex","flex-col","justify-start","gap-1","text-white","text-sm"],["type","submit","routerLink","/onboarding",1,"w-full","h-14","bg-yellow-500","text-white","text-lg","p-2","rounded-lg","font-bold","hover:bg-hover-darkblue"]]},template:function(o,r){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"div",2),e.YNc(3,P,1,0,"shared-error-modal",3),e.ALo(4,"async"),e.TgZ(5,"div",4)(6,"div",5)(7,"h2",6),e.SDv(8,7),e.qZA(),e.TgZ(9,"form",8),e.NdJ("ngSubmit",function(){return r.onSubmit()}),e._UZ(10,"shared-input-field",9)(11,"auth-input-password",10),e.TgZ(12,"div",11)(13,"a",12),e._uU(14,"Olvidaste tu contrase\xf1a?"),e.qZA()(),e.TgZ(15,"button",13),e.SDv(16,14),e.qZA()()()()()(),e.TgZ(17,"div",15)(18,"div",16),e._UZ(19,"img",17),e.TgZ(20,"button",18),e._uU(21," Presentar Reclamaci\xf3n "),e.qZA(),e.TgZ(22,"div",19)(23,"h3"),e._uU(24,"Nuevo en OSD?"),e.qZA(),e.TgZ(25,"button",20),e._uU(26," Crea una cuenta "),e.qZA()()()()()),2&o&&(e.xp6(3),e.Q6J("ngIf",e.lcZ(4,5,r.errorModalOpen$)),e.xp6(6),e.Q6J("formGroup",r.loginForm),e.xp6(1),e.Q6J("formGroup",r.loginForm)("bgColor","bg-white-lightbone"),e.xp6(1),e.Q6J("formGroup",r.loginForm))},dependencies:[u.O5,m.rH,n._Y,n.JL,n.sg,x,T.q,S,u.Ov]}),s})();var Z=a(9707),M=a(6402);function O(t,s){1&t&&e._UZ(0,"shared-error-modal")}let G=(()=>{var t;class s{constructor(o,r,l,p,h,f,g){this.store=o,this.formBuilder=r,this.validationsService=l,this.router=p,this.securityEventService=h,this.securityDataService=f,this.authenticationService=g,this.errorModalOpen$=this.store.select(c.H9.ZI),this.verifyEmailForm=this.createVerifyEmailForm()}ngOnInit(){setTimeout(()=>{this.store.dispatch(d.Nd.hideAll())},0),this.securityDataService.verifyEmailSuccess$.subscribe(o=>{o&&this.router.navigate(["/home"])})}ngOnDestroy(){setTimeout(()=>{this.store.dispatch(d.Nd.showAll())},0)}createVerifyEmailForm(){return this.formBuilder.group({code:["",[n.kI.required],[]]})}onVerify(){this.verifyEmailForm.invalid?this.verifyEmailForm.markAllAsTouched():this.securityEventService.verifyEmail({sessionKey:this.authenticationService.sessionKey,code:this.verifyEmailForm.value.code})}onResendCode(){this.securityEventService.resendEmailVerificationCode({sessionKey:this.authenticationService.sessionKey})}}return(t=s).\u0275fac=function(o){return new(o||t)(e.Y36(w.yh),e.Y36(n.qu),e.Y36(v.k),e.Y36(m.F0),e.Y36(b.Z),e.Y36(Z.F),e.Y36(M.$))},t.\u0275cmp=e.Xpm({type:t,selectors:[["onboarding-verify-email"]],decls:18,vars:6,consts:function(){let i;return i=$localize`:@@signin: Verificar correo `,[[1,"flex","justify-center","items-center","h-full","w-full","py-6"],[1,"w-full","xl:w-full","md:w-11/12","h-full","flex","justify-center","items-center","rounded-3xl","bg-white-lightbone","drop-shadow-2xl","max-w-screen-lg","max-h-[800px]"],[4,"ngIf"],[1,"flex","flex-col","justify-center","items-center","gap-3","p-3","md:mt-0","mt-32"],[1,"bg-darkblue-cyan","text-white-lightbone","rounded-full","text-7xl","p-3","px-4","w-32","h-32","flex","justify-center","items-center"],[1,"fa-regular","fa-envelope-open"],[1,"text-darkblue","text-xl","font-bold"],[1,"text-darkblue"],["src","../../../../assets/img/Logo.png","alt","",1,"block","absolute","top-1","left-3","w-40"],["autocomplete","off",1,"flex","flex-col","items-center","h-4/5","w-full","md:w-4/5","px-2","2xl:px-10","gap-6","mt-16",3,"formGroup"],["fieldName","code","label","C\xf3digo","inputType","text",1,"w-full",3,"formGroup","bgColor"],["type","submit",1,"w-full","h-14","bg-darkblue","text-white","text-lg","p-2","rounded-lg","font-bold","hover:bg-hover-darkblue",3,"click"],i,[1,"cursor-pointer","text-darkblue",3,"click"]]},template:function(o,r){1&o&&(e.TgZ(0,"div",0)(1,"div",1),e.YNc(2,O,1,0,"shared-error-modal",2),e.ALo(3,"async"),e.TgZ(4,"div",3)(5,"div",4),e._UZ(6,"i",5),e.qZA(),e.TgZ(7,"h3",6),e._uU(8," Se te ha enviado un correo electr\xf3nico. "),e.qZA(),e.TgZ(9,"p",7),e._uU(10," Verifique el correo electr\xf3nico asociado con su cuenta utilizando el c\xf3digo enviado a su correo. "),e.qZA(),e._UZ(11,"img",8),e.TgZ(12,"form",9),e._UZ(13,"shared-input-field",10),e.TgZ(14,"button",11),e.NdJ("click",function(){return r.onVerify()}),e.SDv(15,12),e.qZA(),e.TgZ(16,"a",13),e.NdJ("click",function(){return r.onResendCode()}),e._uU(17," Reenviar c\xf3digo "),e.qZA()()()()()),2&o&&(e.xp6(2),e.Q6J("ngIf",e.lcZ(3,4,r.errorModalOpen$)),e.xp6(10),e.Q6J("formGroup",r.verifyEmailForm),e.xp6(1),e.Q6J("formGroup",r.verifyEmailForm)("bgColor","bg-white-lightbone"))},dependencies:[u.O5,n._Y,n.JL,n.sg,x,T.q,u.Ov]}),s})();var L=a(9862);let U=(()=>{var t;class s{constructor(o,r){this.store=o,this.http=r,this.authToken$=this.store.select(c.ce.Y)}getAuthToken(){return this.authToken$}simulateHttpRequest(){return this.http.get("https://jsonplaceholder.typicode.com/todos/1")}}return(t=s).\u0275fac=function(o){return new(o||t)(e.LFG(w.yh),e.LFG(L.eN))},t.\u0275prov=e.Yz7({token:t,factory:t.\u0275fac,providedIn:"root"}),s})();var C=a(7394);const J=["emailInput"];function q(t,s){1&t&&e._UZ(0,"shared-error-modal")}let $=(()=>{var t;class s{constructor(o,r,l,p,h,f,g,F){this.store=o,this.formBuilder=r,this.validationsService=l,this.eventFactoryService=p,this.websocketService=h,this.securityDataService=f,this.router=g,this.securityEventService=F,this.errorModalOpen$=this.store.select(c.H9.ZI),this.errorMessage$=this.store.select(c.H9.N3),this.forgotForm=this.createLoginForm(),this.securityEventSubscriber=new C.w0,this.initialized=!1}ngOnInit(){this.initialized||(this.websocketService.startConnection(),this.initialized=!0),setTimeout(()=>{this.store.dispatch(d.Nd.hideAll())},0),this.securityDataService.userRegisterSuccess$.subscribe(o=>{o&&this.router.navigate(["/home"])})}ngOnDestroy(){this.websocketService.disconnect(),setTimeout(()=>{this.store.dispatch(d.Nd.showAll())},0),this.securityEventSubscriber.unsubscribe()}createLoginForm(){return this.formBuilder.group({email:["",[n.kI.required,this.validationsService.isValidEmail],[]]})}onSubmit(){const r=this.eventFactoryService.CreatePasswordResetToken(this.forgotForm.value.email);this.websocketService.sendSecurityEvent(r),this.websocketService.startConnection()}}return(t=s).\u0275fac=function(o){return new(o||t)(e.Y36(w.yh),e.Y36(n.qu),e.Y36(v.k),e.Y36(y.Q),e.Y36(_.i),e.Y36(Z.F),e.Y36(m.F0),e.Y36(b.Z))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-forgot-password"]],viewQuery:function(o,r){if(1&o&&e.Gf(J,5),2&o){let l;e.iGM(l=e.CRH())&&(r.emailInput=l.first)}},decls:22,vars:6,consts:[[4,"ngIf"],[1,"flex","justify-center","items-center","h-full","w-full","relative"],[1,"relative","w-full","xl:w-full","md:w-11/12","h-full","rounded-3xl","bg-white-lightbone","md:bg-darkblue-cyan","drop-shadow-2xl","max-w-screen-lg","max-h-[800px]"],[1,"text-white","text-3xl","font-bold","absolute","top-48","lg:top-48","2xl:top-1/3","left-14","lg:left-20","xl:left-24","w-52","lg:w-72"],["id","textInfo",1,"absolute","text-white-lightbone","text-sm","text-left","top-80","lg:top-80","2xl:top-2/3","left-14","lg:left-20","xl:left-24"],[1,"white-line"],["src","../../../../assets/svg/kuarc-logo-transparent.svg","alt","Logo",1,"md:block","hidden","absolute","top-1","left-3"],[1,"absolute","bg-white-lightbone","rounded-3xl","right-0","translate-x-[1px]","h-full","py-14","2xl:py-36","flex","flex-col","w-full","md:w-3/5","justify-between","items-center","gap-3"],[1,"flex","flex-col","justify-center","items-center","w-full","h-full","gap-12"],[1,"text-center","text-4xl","text-darkblue","font-bold"],[1,"fa-solid","fa-envelope"],[1,"flex","flex-col","items-center","justify-center","h-4/5","w-full","md:w-4/5","px-2","pb-20","2xl:px-10","gap-4",3,"formGroup"],["fieldName","email","label","Email","inputType","email",1,"w-full",3,"formGroup","bgColor"],[1,"flex","w-full","gap-2"],["type","button","routerLink","/home",1,"flex-1","h-12","bg-darkblue","text-white-lightbone","rounded-lg","font-bold","hover:bg-hover-darkblue","transition","duration-300"],["type","submit",1,"flex-1","h-12","bg-orange","text-white-lightbone","rounded-lg","font-bold","hover:bg-hover-darkblue","transition","duration-300",3,"click"]],template:function(o,r){1&o&&(e.YNc(0,q,1,0,"shared-error-modal",0),e.ALo(1,"async"),e.TgZ(2,"div",1)(3,"div",2)(4,"h3",3),e._uU(5," Olvidaste tu contrase\xf1a? "),e.qZA(),e.TgZ(6,"p",4),e._uU(7," Para crear una contrase\xf1a, introd\xfazcala dos veces para su validaci\xf3n. Escriba la contrase\xf1a deseada en la entrada designada y, a continuaci\xf3n, vuelva a escribirlo en el campo de confirmaci\xf3n para garantizar la precisi\xf3n y la seguridad. "),e.qZA(),e._UZ(8,"div",5)(9,"img",6),e.TgZ(10,"div",7)(11,"div",8)(12,"h2",9),e._UZ(13,"i",10),e._uU(14," Por favor, escriba su correo electr\xf3nico para cambiar la contrase\xf1a "),e.qZA(),e.TgZ(15,"form",11),e._UZ(16,"shared-input-field",12),e.TgZ(17,"div",13)(18,"button",14),e._uU(19," Regresar "),e.qZA(),e.TgZ(20,"button",15),e.NdJ("click",function(){return r.onSubmit()}),e._uU(21," Solicitar cambio "),e.qZA()()()()()()()),2&o&&(e.Q6J("ngIf",e.lcZ(1,4,r.errorModalOpen$)),e.xp6(15),e.Q6J("formGroup",r.forgotForm),e.xp6(1),e.Q6J("formGroup",r.forgotForm)("bgColor","bg-white-lightbone"))},dependencies:[u.O5,m.rH,n._Y,n.JL,n.sg,x,T.q,u.Ov],styles:["#textInfo[_ngcontent-%COMP%]{font-size:1em;width:25%}"]}),s})();const V=t=>{const s=t.get("password"),i=t.get("repassword");return s&&i&&s.value!==i.value?{passwordmatcherror:!0}:null},R=function(t,s){return{"fa-eye":t,"fa-eye-slash":s}};let j=(()=>{var t;class s{constructor(){this.name="Repetir contrase\xf1a",this.showPassword=!1,this.inputPasswordType="password"}togglePasswordVisibility(){this.showPassword=!this.showPassword,this.inputPasswordType=this.showPassword?"text":"password"}}return(t=s).\u0275fac=function(o){return new(o||t)},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-input-newpassword"]],inputs:{formGroup:"formGroup",name:"name"},decls:7,vars:7,consts:[[1,"relative","w-full",3,"formGroup"],[1,"bg-white-lightbone","absolute","top-[-15px]","left-6","p-1"],["for","",1,"text-darkgray"],["formControlName","repassword","id","repassword","name","password",1,"placeholder:text-darkgray","block","bg-white-lightbone","border-solid","border-2","border-ligthgray","w-full","rounded-lg","p-2","pl-9","pr-3","h-14","shadow-sm","focus:outline-none","focus:ring","focus:lightblue-cyan",3,"type"],["type","button",1,"absolute","top-2","right-2","mt-2","mr-2","pt-0.5","rounded-full","text-gray-500","hover:text-blue-500",3,"click"],["aria-hidden","true",1,"fa","text-darkgray",3,"ngClass"]],template:function(o,r){1&o&&(e.TgZ(0,"div",0)(1,"div",1)(2,"label",2),e._uU(3),e.qZA()(),e._UZ(4,"input",3),e.TgZ(5,"button",4),e.NdJ("click",function(){return r.togglePasswordVisibility()}),e._UZ(6,"i",5),e.qZA()()),2&o&&(e.Q6J("formGroup",r.formGroup),e.xp6(3),e.Oqu(r.name),e.xp6(1),e.Q6J("type",r.inputPasswordType),e.xp6(2),e.Q6J("ngClass",e.WLB(4,R,r.showPassword,!r.showPassword)))},dependencies:[u.mk,n.Fj,n.JJ,n.JL,n.sg,n.u]}),s})();function Q(t,s){1&t&&e._UZ(0,"shared-error-modal")}function z(t,s){1&t&&(e.TgZ(0,"p",15),e._uU(1,"Las contrase\xf1as son diferentes"),e.qZA())}const H=[{path:"",component:I},{path:"verify-email",canMatch:[(t,s)=>(0,e.f3M)(U).getAuthToken()],component:G},{path:"forgot-password",component:$},{path:"newpassword",component:(()=>{var t;class s{constructor(o,r,l,p,h,f,g,F){this.store=o,this.router=r,this.fb=l,this.validationsService=p,this.securityDataService=h,this.eventFactoryService=f,this.websocketService=g,this.securityEventService=F,this.showError=!1,this.name="Type a new Password here",this.errorModalOpen$=this.store.select(c.H9.ZI),this.errorMessage$=this.store.select(c.H9.N3),this.passwordForm=this.createLoginForm(),this.securityEventSubscriber=new C.w0,this.initialized=!1}changeFieldName(o){this.name=o}ngOnInit(){this.initialized||(this.websocketService.startConnection(),this.initialized=!0),setTimeout(()=>{this.store.dispatch(d.Nd.hideAll())},0),window.location.hash||this.router.navigate(["/"]),this.securityDataService.userRegisterSuccess$.subscribe(r=>{r&&this.router.navigate(["/"])})}ngOnDestroy(){this.websocketService.disconnect(),setTimeout(()=>{this.store.dispatch(d.Nd.showAll())},0),this.securityEventSubscriber.unsubscribe()}redirectToAuth(){this.router.navigate(["/auth"])}createLoginForm(){return this.fb.group({password:["",[n.kI.required,n.kI.minLength(6)]],repassword:[""]},{validators:[V]})}onSubmit(){const r=window.location.hash.substring(1),p=this.eventFactoryService.UpdatePassword(r,this.passwordForm.value.password);this.websocketService.sendSecurityEvent(p),this.websocketService.startConnection()}}return(t=s).\u0275fac=function(o){return new(o||t)(e.Y36(w.yh),e.Y36(m.F0),e.Y36(n.qu),e.Y36(v.k),e.Y36(Z.F),e.Y36(y.Q),e.Y36(_.i),e.Y36(b.Z))},t.\u0275cmp=e.Xpm({type:t,selectors:[["app-newpassword"]],decls:22,vars:9,consts:[[4,"ngIf"],[1,"flex","justify-center","items-center","h-full","w-full","relative"],[1,"relative","w-full","xl:w-full","md:w-11/12","h-full","rounded-3xl","rounded-r-8xl","bg-white-lightbone","md:bg-darkblue-cyan","drop-shadow-2xl","max-w-screen-lg","max-h-[800px]"],[1,"text-white-lightbone","text-xl","font-bold","absolute","top-48","lg:top-48","2xl:top-1/3","left-14","lg:left-20","xl:left-24","w-52","lg:w-72"],["src","../../../../assets/svg/kuarc-logo-transparent.svg","alt","",1,"md:block","hidden","absolute","top-1","left-3",3,"click"],["id","textInfo",1,"absolute","text-white-lightbone","text-sm","text-left","top-80","lg:top-80","2xl:top-2/3","left-14","lg:left-20","xl:left-24"],[1,"absolute","bg-white-lightbone","rounded-3xl","right-0","translate-x-[1px]","h-full","py-14","2xl:py-36","flex","flex-col","w-full","md:w-3/5","justify-between","items-center","gap-3"],[1,"flex","flex-col","justify-center","items-center","w-full","h-full","gap-6"],[1,"text-center","text-4xl","text-darkblue","font-bold"],[1,"flex","flex-col","items-center","justify-center","h-4/5","w-full","md:w-4/5","px-2","pb-20","2xl:px-10","gap-6",3,"formGroup"],["id","pass1","fieldName","password",1,"w-full",3,"formGroup","name"],[1,"w-full",3,"formGroup"],["id","errorMessage"],["class","text-red-500 text-left text-sm",4,"ngIf"],["type","submit",1,"w-full","h-14","bg-darkblue","text-white","p-2","rounded-lg","font-bold","hover:bg-hover-darkblue",3,"disabled","click"],[1,"text-red-500","text-left","text-sm"]],template:function(o,r){if(1&o&&(e.YNc(0,Q,1,0,"shared-error-modal",0),e.ALo(1,"async"),e.TgZ(2,"div",1)(3,"div",2)(4,"h3",3),e._uU(5," Cambio de contrase\xf1a "),e.qZA(),e.TgZ(6,"img",4),e.NdJ("click",function(){return r.redirectToAuth()}),e.qZA(),e.TgZ(7,"p",5),e._uU(8," Para crear una contrase\xf1a, introd\xfazcala dos veces para su validaci\xf3n. Escriba la contrase\xf1a deseada en la entrada designada y, a continuaci\xf3n, vuelva a escribirlo en el campo de confirmaci\xf3n para garantizar la precisi\xf3n y la seguridad. "),e.qZA(),e.TgZ(9,"div",6)(10,"div",7)(11,"h2",8),e._uU(12," Crear nueva contrase\xf1a "),e.qZA(),e.TgZ(13,"form",9),e._UZ(14,"auth-input-password",10)(15,"app-input-newpassword",11),e.TgZ(16,"div",12),e.YNc(17,z,2,0,"p",13),e.qZA(),e.TgZ(18,"button",14),e.NdJ("click",function(){return r.onSubmit()}),e._uU(19," Cambiar contrase\xf1a "),e.qZA()()()()()(),e.TgZ(20,"p"),e._uU(21,"newpassword works!"),e.qZA()),2&o){let l;e.Q6J("ngIf",e.lcZ(1,7,r.errorModalOpen$)),e.xp6(13),e.Q6J("formGroup",r.passwordForm),e.xp6(1),e.Q6J("formGroup",r.passwordForm)("name",r.name),e.xp6(1),e.Q6J("formGroup",r.passwordForm),e.xp6(2),e.Q6J("ngIf",r.passwordForm.hasError("passwordmatcherror")&&(null==(l=r.passwordForm.get("repassword"))?null:l.touched)),e.xp6(1),e.Q6J("disabled",r.passwordForm.invalid)}},dependencies:[u.O5,n._Y,n.JL,n.sg,x,S,j,u.Ov],styles:["#textInfo[_ngcontent-%COMP%]{font-size:1em;width:25%}#errorMessage[_ngcontent-%COMP%]{font-size:13px;text-align:left;color:red}"]}),s})()}];let D=(()=>{var t;class s{}return(t=s).\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[m.Bz.forChild(H),m.Bz]}),s})();var X=a(9065);let B=(()=>{var t;class s{}return(t=s).\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[u.ez,D,n.UX,X.SharedModule,n.u5]}),s})()}}]);