(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{11:function(e,t,a){e.exports=a(28)},16:function(e,t,a){},20:function(e,t,a){},22:function(e,t,a){},24:function(e,t,a){},26:function(e,t,a){},28:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(5),c=a.n(r),l=(a(16),a(2)),i=a.n(l),o=a(3),u=a(6),k=a(7),d=a(9),p=a(8),h=a(10),m=a(1);a(20);var T=function(e){var t=e.task,a=t.task_id,n=(t.task_creation_dt,t.task_title),r=t.task_desc,c=t.task_completed,l=t.task_scheduled_dt,i=t.priority_desc,o=l?l.substring(0,10):"",u="High"===i?"task__priority--high":"task__priority";return s.a.createElement("div",{className:"task"},s.a.createElement("form",{id:a,autoComplete:"off"},s.a.createElement("input",{className:"task__title",type:"text",name:"task_title",value:n,onChange:e.handleTaskUpdate,onBlur:e.putTaskUpdate}),s.a.createElement("input",{className:"task__completed",type:"checkbox",name:"task_completed",checked:c,onChange:e.handleTaskUpdate,onBlur:e.putTaskUpdate}),s.a.createElement("input",{className:"task__desc",type:"text",name:"task_desc",placeholder:"...",value:r,onChange:e.handleTaskUpdate,onBlur:e.putTaskUpdate}),s.a.createElement("input",{className:"task__scheduledDt",type:"date",name:"task_scheduled_dt",value:o,onChange:e.handleTaskUpdate,onBlur:e.putTaskUpdate}),s.a.createElement("select",{className:u,name:"priority_desc",value:i,onChange:e.handleTaskUpdate,onBlur:e.putTaskUpdate},s.a.createElement("option",null,"High"),s.a.createElement("option",null,"Medium"),s.a.createElement("option",null,"Low"))))},_=(a(22),function(e){return s.a.createElement("button",{className:"newTaskButton",type:"button",onClick:e.postNewTask},"Add Task")}),f=(a(24),function(e){return s.a.createElement("div",{className:"newTaskForm"},s.a.createElement("form",null,s.a.createElement("input",{className:"newTaskForm__titleInput",type:"text",placeholder:"Task Title",value:e.newTaskTitle,onChange:e.handleNewTaskChange}),s.a.createElement(_,{postNewTask:e.postNewTask})))}),w=(a(26),function(e){function t(e){var a;return Object(u.a)(this,t),(a=Object(d.a)(this,Object(p.a)(t).call(this,e))).getAllTasks=Object(o.a)(i.a.mark(function e(){var t;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("/allTasks");case 2:return t=e.sent,e.next=5,t.json().then(function(e){a.setState({isFetched:!0,tasks:e})},function(e){a.setState({error:e,isFetched:!0})});case 5:case"end":return e.stop()}},e)})),a.postNewTask=Object(o.a)(i.a.mark(function e(){var t,n,s,r;return i.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(""!==(t=a.state.newTaskTitle)){e.next=3;break}return e.abrupt("return");case 3:return n=a.state.tasks.map(function(e){return e.task_id}).reduce(function(e,t){return t>e?t:e}),s={task_id:n+1,task_creation_dt:"",task_title:t,task_desc:"",task_completed:"",task_scheduled_dt:"",priority_desc:"Low"},(r=JSON.parse(JSON.stringify(a.state.tasks))).push(s),a.setState({tasks:r}),a.setState({newTaskTitle:""}),e.next=12,fetch("/addTask/".concat(t),{method:"POST"});case 12:case"end":return e.stop()}},e)})),a.state={error:null,isFetched:!1,tasks:[],newTaskTitle:""},a.getAllTasks=a.getAllTasks.bind(Object(m.a)(Object(m.a)(a))),a.putTaskUpdate=a.putTaskUpdate.bind(Object(m.a)(Object(m.a)(a))),a.handleTaskUpdate=a.handleTaskUpdate.bind(Object(m.a)(Object(m.a)(a))),a.handleNewTaskChange=a.handleNewTaskChange.bind(Object(m.a)(Object(m.a)(a))),a.postNewTask=a.postNewTask.bind(Object(m.a)(Object(m.a)(a))),a}return Object(h.a)(t,e),Object(k.a)(t,[{key:"putTaskUpdate",value:function(e){var t,a=Number(e.target.parentNode.id),n=e.target.name;"task_title"===n&&""===t||(t="task_completed"===n?!!e.target.checked:e.target.value,fetch("/amendTask/".concat(a,"/field/").concat(n,"/value/").concat(t),{method:"PUT"}))}},{key:"handleTaskUpdate",value:function(e){var t,a=Number(e.target.parentNode.id),n=e.target.name;t="task_completed"===n?!!e.target.checked:e.target.value;var s=this.state.tasks.map(function(e){return e.task_id===a?function(e){var a=JSON.parse(JSON.stringify(e));return a[n]=t,a}(e):e});this.setState({tasks:s})}},{key:"handleNewTaskChange",value:function(e){var t=e.target.value;this.setState({newTaskTitle:t})}},{key:"componentDidMount",value:function(){this.getAllTasks()}},{key:"render",value:function(){var e=this,t=this.state,a=t.error,n=t.isFetched;if(a)return s.a.createElement("section",null,s.a.createElement("p",null,"Sorry, something went wrong. Please try again."));if(n){var r=this.state.tasks.map(function(t){return s.a.createElement(T,{key:t.task_id,task:t,handleTaskUpdate:e.handleTaskUpdate,putTaskUpdate:e.putTaskUpdate})});return s.a.createElement("section",{className:"tasksContainer"},r,s.a.createElement(f,{newTaskTitle:this.state.newTaskTitle,handleNewTaskChange:this.handleNewTaskChange,postNewTask:this.postNewTask}))}return s.a.createElement("section",null,s.a.createElement("p",null,"Your tasks are loading..."))}}]),t}(n.Component));c.a.render(s.a.createElement(w,null),document.getElementById("root"))}},[[11,2,1]]]);
//# sourceMappingURL=main.b35b716b.chunk.js.map