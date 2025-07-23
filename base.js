/*

	As you can see, i'm not a javascript master (Me neither!)
	The code is full of functions :o

	Btw, there are very very few comments that explain the code >:) HAHAHAHA
	
	(Not really a problem, the code is very self-explanatory.) 

	Hope you enjoyed the game (I did!)
	(I want you to read this after finishing the game or things in this game may be spoiled to you)

*/

var enemy_attack_timer;
var healthtimeout;
var skilltimeout;
var potiontimeout;
var invulnerabilitydelay;
var irondivisor = 600;
var golddivisor = 200;
var secondrealm = false;
var instasused = 0;
var battleid = 1;
var winningbattle = false;
var pizzacollected;
var changecredits = true;
var ironcounter = 0;
var shieldnames = ["Wooden Shield", "Stone Shield", "Iron Shield", "Diamond Shield"];
function randomnumber(min,max) {
	return Math.floor(Math.random()*(max-min)+min);
}
function closemessage() {
	$(".alert").fadeOut("fast");
	$(".modal").hide();
}
function updategold() {
	$("#gold-bar").html(goldbar.toLocaleString("en"));
	$("#iron-bar").html(ironbar.toLocaleString("en"));

	if(ironmining>0 && ironmining<=59) {
		ibpt=ironmining;
		ibtime=3600;
	}
	else if(ironmining>59 && ironmining<=195) {
		ibpt=Math.round((ironmining-59)/2.3);
		if(ibpt<=0) {
			ibpt=1;
		}
		ibtime=60;
	}
	else if(ironmining>195 && ironmining<4693) {
		ibpt=Math.round((ironmining-195)/4.5);
		if(ibpt<=0) {
			ibpt=1;
		}
		ibtime=1;
	}
	else if(ironmining>=4693) {
		ibpt=1000 + Math.round((ironmining-4693)/45);
		ibtime=1;
	}
	if(goldmining<30) {
		goldmining=30;
	}

	if(buyfactory==true) {
		gbps=Math.round(goldmining/10);
	}
}
function updateitems() {
	$("#otheritems").html("");
	for(i=0;i<items.length;i++) {
		thisitem=items[i];
		if(thisitem.owned>0 && thisitem.showstorage) {
			if(thisitem.owned!=1) {
				plural=thisitem.plural;
			}
			else {
				plural="";
			}
			thestorage=$("#otheritems").html();
			$("#otheritems").html(thestorage+"<br>"+thisitem.owned.toLocaleString("en")+" "+thisitem.name+plural);
		}
	}
	cut=$("#otheritems").html().substring(4);
	$("#otheritems").html(cut);
	$(".iron-mining-amount").html(ironmining.toLocaleString("en"));
	$(".ibpt").html(ibpt.toLocaleString("en"));
    $(".skilllvl").html(skilllvl.toLocaleString("en"));
    $(".thunder-damage").html((20+skilllvl*10).toLocaleString("en"));
    $(".invuln-time").html((3+skilllvl).toLocaleString("en"));
    $(".upgrade-price").html((skilllvl*skilllvl*500+500).toLocaleString("en"));
	$(".change-price").html((skilllvl*skilllvl*250+250).toLocaleString("en"));
	$(".irontime").html(second2name(ibtime));
	$(".gold-mining").html(goldmining.toLocaleString("en"));
	$(".gbps").html(gbps.toLocaleString("en"));
	ironprice=10+Math.floor(ironmining*ironmining/irondivisor);
	$(".1-iron-cost").html(ironprice.toLocaleString("en"));
	$(".10-iron-cost").html(calculateTotalPrice(ironmining, 10, irondivisor).toLocaleString("en"));
	$(".100-iron-cost").html(calculateTotalPrice(ironmining, 100, irondivisor).toLocaleString("en"));
	goldprice=10+Math.floor(goldmining*goldmining/golddivisor);
	$(".1-gold-cost").html(goldprice.toLocaleString("en"));
	$(".10-gold-cost").html(calculateTotalPrice(goldmining, 10, golddivisor).toLocaleString("en"));
	$(".100-gold-cost").html(calculateTotalPrice(goldmining, 100, golddivisor).toLocaleString("en"));

	if(enchant_attack==0 && enchant_defense==0 && enchant_countdown==0 && enchant_life==0) {
		$(".enchants").html("Your sword is not enchanted. You should probably do something about that.<br>");
	}
	else {
		enchant_html="Your sword is enchanted with:<br>";
		if(enchant_attack>0) { enchant_html=enchant_html+"Attack "+enchant_attack.toLocaleString("en")+" (+"+(enchant_attack*7).toLocaleString("en")+" base damage.)<br>"; }
		if(enchant_defense>0) { enchant_html=enchant_html+"Defense "+enchant_defense.toLocaleString("en")+" (Absorbs "+(enchant_defense*2).toLocaleString("en")+"% damage)<br>"; }
		if(enchant_countdown>0) { enchant_html=enchant_html+"Attack Speed "+enchant_countdown.toLocaleString("en")+" (You attack once every "+(attackspeed*3)/1000+" seconds.)<br>"; }
		if(enchant_life>0) { enchant_html=enchant_html+"Life "+enchant_life.toLocaleString("en")+" (Heals "+(enchant_life*2).toLocaleString("en")+" HP each time you attack.)<br>"; }
		$(".enchants").html(enchant_html);
	}
	$(".enchant-attack-price").html((enchant_attack*enchant_attack*(1000 + ((enchant_countdown + enchant_life) * 500))+2000).toLocaleString("en"));
	$(".enchant-defense-price").html((enchant_defense*enchant_defense*1000+2500).toLocaleString("en"));
	$(".enchant-countdown-price").html((enchant_countdown*enchant_countdown*(1000 + ((enchant_attack + enchant_life) * 500))+3000).toLocaleString("en"));
	$(".enchant-life-price").html((enchant_life*enchant_life*(1000 + ((enchant_attack + enchant_countdown) * 500))+2500).toLocaleString("en"));
	$(".button-enchant-attack").attr("value","Attack "+(enchant_attack+1).toLocaleString("en"));
	$(".button-enchant-defense").attr("value","Defense "+(enchant_defense+1).toLocaleString("en"));
	$(".button-enchant-life").attr("value","Life "+(enchant_life+1).toLocaleString("en"));
	$(".button-enchant-countdown").attr("value","Attack Speed "+(enchant_countdown+1).toLocaleString("en"));

	if(enchant_countdown>=5) {
		$(".button-enchant-countdown").hide();
		$(".enchant-countdown-price-whole").hide();
		$(".enchant-sword-countdown-max").show();
	}
	else{
		$(".button-enchant-countdown").show();
		$(".enchant-countdown-price-whole").show();
		$(".enchant-sword-countdown-max").hide();
	}
	if(enchant_defense==10) { $(".button-enchant-defense").attr("disabled",true); }
	if(airplanecountdown==0) {
		if(typeof flyingabcd !== 'undefined') {
			clearInterval(flyingabcd);
		}
		reachedclouds=true;
	}
	if(airplanecountdown<0) {
		airplanecountdown=0;
	}

	if(digcountdown<=0) {
		clearInterval(digabcd);
		dig(false);
		digcountdown=999999999;
	}

	if(helmet==0) {
		$(".button-buy-helmet").val("Buy a leather helmet");
	}
	else if(helmet<=1) {
		$(".button-buy-helmet").val("Buy a chain helmet");
	}
	else if(helmet<=2) {
		$(".button-buy-helmet").val("Buy an iron helmet");
	}
	else if(helmet<=3) {
		$(".button-buy-helmet").val("Buy a diamond helmet");
	}
	else {
		$(".helmet-area").html("Sorry, I have no better helmet for you.");
	}

	if(chestplate<=0) {
		$(".button-buy-chestplate").val("Buy a leather ch estplate");
	}
	else if(chestplate<=2) {
		$(".button-buy-chestplate").val("Buy a chain chestplate");
	}
	else if(chestplate<=4) {
		$(".button-buy-chestplate").val("Buy an iron chestplate");
	}
	else if(chestplate<=6) {
		$(".button-buy-chestplate").val("Buy a diamond plate");
	}
	else {
		$(".chestplate-area").html("Sorry, I have no better chestplate for you.");
	}

	if(pants<=0) {
		$(".button-buy-pants").val("Buy leather pants");
	}
	else if(pants<=1.5) {
		$(".button-buy-pants").val("Buy chain pants");
	}
	else if(pants<=3) {
		$(".button-buy-pants").val("Buy iron pants");
	}
	else if(pants<=4.5) {
		$(".button-buy-pants").val("Buy diamond pants");
	}
	else {
		$(".pants-area").html("Sorry, I have no better pants for you.");
	}

	if(boots<=0) {
		$(".button-buy-boots").val("Buy leather boots");
	}
	else if(boots<=0.5) {
		$(".button-buy-boots").val("Buy chain boots");
	}
	else if(boots<=1) {
		$(".button-buy-boots").val("Buy iron boots");
	}
	else if(boots<=1.5	) {
		$(".button-buy-boots").val("Buy diamond boots");
	}
	else {
		$(".boots-area").html("Sorry, I have no better boots for you.");
	}

	$(".buy-helmet-price").html(((helmet)*2000+1000).toLocaleString("en"));
	$(".buy-chestplate-price").html(((chestplate)*2000+1000).toLocaleString("en"));
	$(".buy-pants-price").html(((pants)*2000+1000).toLocaleString("en"));
	$(".buy-boots-price").html(((boots)*2000+1000).toLocaleString("en"));

	$(".absorb-percent").html(helmet+chestplate+pants+boots);

	$(".current-cookie").html((items[19].owned).toLocaleString("en"));
	$(".cps").html(cursor/10);
	$(".cursor-button").val("Cursor ["+cursor+"]");
	$(".cursor-price").html(15*Math.pow(1.15,cursor));

	$(".airplanecd").html(airplanecountdown.toLocaleString("en"));

	if(digcountdown <= 100) {
		$(".digcd").html(digcountdown.toLocaleString("en"));
	}
	else {
		$(".digcd").html("Done!");
	}
	$("#hurry-dig-button").val("Use another shovel ["+items[1].owned.toLocaleString("en")+"]");

	if(items[2].owned>=1) {
		$(".wooden-sword-shop").hide();
		$(".stone-sword-shop").show();
	}
	if(items[4].owned>=1) {
		$(".stone-sword-shop").hide();
		$(".no-sword-upgrade").show();
	}
	if(items[5].owned>=1) {
		$(".iron-sword-shop").hide();
		$(".diamond-sword-shop").show();
	}
	if(items[6].owned>=1) {
		$(".diamond-sword-shop").hide();
		$(".no-sword-upgrade-2").show();
	}
	if(shieldlevel > 3){
		$(".iron-shield-shop").hide();
		$(".diamond-shield-shop").hide();
		$(".no-shield-upgrade-2").show();
	}
	else if(shieldlevel > 2) {
		$(".iron-shield-shop").hide();
		$(".diamond-shield-shop").show();
	}
	if(shieldlevel > 1) {
		$(".wooden-shield-shop").hide();
		$(".stone-shield-shop").hide();
		$(".no-shield-upgrade").show();
	}
	else if(shieldlevel > 0) {
		$(".wooden-shield-shop").hide();
		$(".stone-shield-shop").show();
	}
	if(pizzaeaten==="poisoned") {
		pizzaeaten=true;
	}

}
function checkbuilding() {
	if(items[1].owned>=1 || passthief) {
		$(".sign").removeClass("hidden");
	}
	if(passthief) {
		$(".sign").css("cursor","default");
		$(".dig-step-1").removeClass("hidden");
		$(".anothershop").removeClass("hidden");
		$(".gate").removeClass("hidden");
	}
	if(passworms) {
		$(".dig-step-1").css("cursor","default").attr("title","");
		$(".dig-step-2").removeClass("hidden");
		$(".underworld-building").removeClass("hidden");
	}
	if(passgate) {
		$(".gate").html('\n\
\n\
\n\
\n\
\n\
 _ ______\n\
| |      |\n\
| |      |\n\
| |      |\n\
| |      |\n\
| |      |\n\
|_|______|');
		$(".gate").attr("title","Unlocked Gate");
		$(".gate").css("cursor","default");
		$(".enchant").removeClass("hidden");
		$(".hill").removeClass("hidden");
		$(".chest").removeClass("hidden");
		$(".phone").removeClass("hidden");
		$(".castle").removeClass("hidden");
	}
	if(items[9].owned==14 || hasportal) {
		$(".laboratory").removeClass("hidden");
		$(".airplane").removeClass("hidden");
		if(items[8].owned == 1)
			{
				$(".portal").removeClass("hidden");	
				items[9].owned=0;
				hasportal=true;
			}
	}
	if(reachedclouds) {
planeascii='.--. _        ,---.   ___\n\
 \\# `----------"---=<_)_)_>-.\n\
 `,_/________.-----,_____,.-`\n\
      o\'     `-===\'   `o,   ';
		$("#wrapper").css("top","250px");
		$(".banner-plane").addClass("reachedclouds");
		$(".cloud-4").removeClass("hidden");
		$(".airplane").html(planeascii);
		$(".airplane").css({"top":"-250px", "left":"1100px", "cursor":"default"});
	}
	if(items[24].owned==1) {
		$(".travel").removeClass("hidden");
	}
	if(gethole) {
		$(".hole").removeClass("hidden");
	}
	if(win) {
		$(".endlessgate").removeClass("hidden");
	}
}
function updatestatus() {
	offhandtext = "None!";
	offhanddescription = "None!";
	if(items[3].owned!=1){plural=items[3].plural;}else{plural="";}
	$(".pizzacount").html(items[3].owned.toLocaleString("en")+" pizza"+plural);
	$(".maxhealth").html(100 + Math.floor(items[3].owned/3.5));
	if(currentsword != "none"){
		$(".currentsword").html(currentsword.substring(0, currentsword.indexOf('Sword')) + weapontype);
	}
	else{
		$(".currentsword").html("None!");
	}

	if(offhand != "none"){
		if(offhand == "Shield"){
			offhandtext=shieldnames[shieldlevel-1];
			offhanddescription="Shields you from "+shieldlevel*5+"% of the damage you receive."
		}
		else if(offhand == "Watch"){
			offhandtext="Professor's Watch";
			offhanddescription="Makes all of your countdowns 5% faster!"
		}
		else if(offhand == "Dagger"){
			offhandtext="Thief's Dagger";
			offhanddescription="Gives you gold bars each time you attack with your main weapon, equal to 25% of damage dealt.";
		}
		else if(offhand == "Pizza"){
			offhandtext="Pizza Box Shield";
			offhanddescription="unimplemented";
		}
		else if(offhand == "Shurikens"){
			offhandtext="Shurikens"
			offhanddescription="unimplemented";
		}
		else if(offhand == "Totem"){
			offhandtext="Totem of Undying";
			offhanddescription="unimplemented";
		}
		else if(offhand == "Suitcase"){
			offhandtext="Strange Suitcase";
			offhanddescription="Causes a random potion effect each time you use your skill. Anything could happen!"
		}
	}
	$(".currentoffhand").html(offhandtext);
	$("#offhanddescription").html(offhanddescription);
	$(".username").html(theusername);
	$(".userdesc").html(theuserdesc);
	powerhp();
	$(".damagedisplay").html(power);
	$(".attackspeeddisplay").html((attackspeed*3)/1000);
	$(".lifestealdisplay").html(enchant_life*2);
}
function checkitem() {
	for(i=0;i<items.length;i++) {
		thisitem=items[i];
		itemnamenospace=thisitem.name.replace(" ","-");
		if(goldbar>=thisitem.price) {
			$(".buy-"+itemnamenospace).removeAttr("disabled");
		}
		else {
			$(".buy-"+itemnamenospace).attr("disabled",true);
		}
	}
	if(goldbar < 400) { $(".buy-pizza-20").attr("disabled",true); } else { $(".buy-pizza-20").removeAttr("disabled"); }
	if(goldbar < 100) { $(".buy-iron-bar").attr("disabled",true); } else { $(".buy-iron-bar").removeAttr("disabled"); }
	if(goldbar < 20) { $(".training-button").attr("disabled",true); }else { $(".training-button").removeAttr("disabled"); }
	if(goldbar < ironprice) { $(".buy-1-mining").attr("disabled",true); } else { $(".buy-1-mining").removeAttr("disabled"); }
	if(goldbar < calculateTotalPrice(ironmining, 10, irondivisor)) { $(".buy-10-mining").attr("disabled",true); } else { $(".buy-10-mining").removeAttr("disabled"); }
	if(goldbar < calculateTotalPrice(ironmining, 100, irondivisor)) { $(".buy-100-mining").attr("disabled",true); } else { $(".buy-100-mining").removeAttr("disabled"); }
	if(goldbar < (skilllvl+1)) { $(".upgrade-price").attr("disabled",true); } else { $(".upgrade-price").removeAttr("disabled"); }
	if(goldbar < 2500) { $(".buy-factory-button").attr("disabled",true); } else { $(".buy-factory-button").removeAttr("disabled"); }
	if(ironbar < goldprice) { $(".buy-1-mining-gold").attr("disabled",true); } else { $(".buy-1-mining-gold").removeAttr("disabled"); }
	if(ironbar < calculateTotalPrice(goldmining, 10, golddivisor)) { $(".buy-10-mining-gold").attr("disabled",true); } else { $(".buy-10-mining-gold").removeAttr("disabled"); }
	if(ironbar < calculateTotalPrice(goldmining, 100, golddivisor)) { $(".buy-100-mining-gold").attr("disabled",true); } else { $(".buy-100-mining-gold").removeAttr("disabled"); }
	if(items[1].owned <= 0) { $("#hurry-dig-button").attr("disabled",true); } else { $("hurry-dig-button").removeAttr("disabled"); }
}
function buy(item,number) {
	for(i=0;i<items.length;i++) {
		thisitem=items[i];
		if(item==thisitem.name) {
			if(goldbar>=thisitem.price*number) {
				valid=true;
				if(i==2) {
					currentsword="Wooden Sword";
					$(".wooden-sword-shop").hide();
					$(".stone-sword-shop").show();
				}
				else if(i==4) {
					if(items[2].owned!=0) {
						currentsword="Stone Sword";
						$(".stone-sword-shop").hide();
						$(".no-sword-upgrade").show();
					}
					else {
						valid=false;
					}
				}
				else if(i==5) {
					if(items[4].owned!=0) {
						currentsword="Iron Sword";
						$(".iron-sword-shop").hide();
						$(".diamond-sword-shop").show();
					}
					else {
						alert("You don't have a stone sword!");
						valid=false;
					}
				}
				else if(i==6) {
					if(items[5].owned!=0) {
						currentsword="Diamond Sword";
						$(".diamond-sword-shop").hide();
						$(".need-iron").show();
					}
					else {
						valid=false;
					}
				}
				if(valid) {
					goldbar-=thisitem.price*number;
					thisitem.owned+=number;
					checkthings();
				}
			}
			break;
		}
	}
}
function buyminingmachine(amount) {
	theprice=calculateTotalPrice(ironmining, amount, irondivisor);
	if(goldbar>=theprice) {
		goldbar-=theprice;
		ironmining+=amount;
		checkthings();
	}
}
function buyminingmachinegold(amount) {
	theprice=calculateTotalPrice(goldmining, amount, golddivisor);
	if(ironbar>=theprice) {
		ironbar-=theprice;
		goldmining+=amount;
		checkthings();
	}
}
function enchantsword(type) {
	if(type=="attack") {
		price=enchant_attack*enchant_attack*(1000 + ((enchant_countdown + enchant_life) * 500))+2000;
		if(goldbar>=price) {
			goldbar-=price;
			enchant_attack++;
			checkthings();
		}
	}
	else if(type=="defense") {
		if(enchant_defense<10) {
			price=enchant_defense*enchant_defense*1000+2500;
			if(goldbar>=price) {
				goldbar-=price;
				enchant_defense++;
				checkthings();
			}
		}
	}
	else if(type=="countdown") {
		price=enchant_countdown*enchant_countdown*(1000 + ((enchant_attack + enchant_life) * 500))+3000;
		if(goldbar>=price) {
			goldbar-=price;
			enchant_countdown++;
			checkthings();
		}
	}
	else if(type=="life") {
		price=enchant_life*enchant_life*(1000 + ((enchant_attack + enchant_countdown) * 500))+2500;
		if(goldbar>=price) {
			goldbar-=price;
			enchant_life++;
			checkthings();
		}
	}
}
function respec() {
	if(confirm("Are you sure you want to reset your enchantments? You will not get any gold bars back!")){
		enchant_attack = 0;
		enchant_countdown = 0;
		enchant_life = 0;
		checkthings();
	}
}
function reforge(newtype) {
	if(newtype == weapontype){
		alert("You already wield the "+weapontype+"!");
		return;
	}
	reforgeprice = 500;
	if(newtype=="Maul"){
		reforgeprice = 2500;
	}
	if(ironbar >= reforgeprice){
		weapontype = newtype;
		ironbar -= reforgeprice;
		alert("Success! You now wield the "+weapontype+".");
		if(newtype="Maul"){
			offhand="none";
		}
	}
	else{
		alert("You don't have enough iron bars!");
	}
}
$(document).ready(function() {

	$('.leversion').html("1.v3.0 BETA");

	goldbar=0; //0
	ironbar=0; //0
	gbps=1;
	goldmining=30;
	ibpt=0;
	ibtime=3600;
	ironmining=0;

	items=[];
	items.push({"name":"torch","price":10,"owned":0,"plural":"es","showstorage":true}); //0
	items.push({"name":"shovel","price":50,"owned":0,"plural":"s","showstorage":true}); //1
	items.push({"name":"wooden sword","price":50,"owned":0,"plural":"s","showstorage":false}); //2
	items.push({"name":"pizza","price":20,"owned":0,"plural":"s","showstorage":false}); //3
	items.push({"name":"stone sword","price":500,"owned":0,"plural":"s","showstorage":false}); //4
	items.push({"name":"iron sword","price":1000,"owned":0,"plural":"s","showstorage":false}); //5
	items.push({"name":"diamond sword","price":3000,"owned":0,"plural":"s","showstorage":false}); //6
	items.push({"name":"health potion","price":50,"owned":0,"plural":"s","showstorage":true}); //7
	items.push({"name":"ancient scroll","price":0,"owned":0,"plural":"s","showstorage":true}); //8
	items.push({"name":"obsidian cube","price":0,"owned":0,"plural":"s","showstorage":true}); //9
	items.push({"name":"lava bucket","price":0,"owned":0,"plural":"s","showstorage":true}); //10
	items.push({"name":"empty potion","price":0,"owned":0,"plural":"s","showstorage":true}); //11
	items.push({"name":"poison potion","price":0,"owned":0,"plural":"s","showstorage":true}); //12
	items.push({"name":"confusion potion","price":0,"owned":0,"plural":"s","showstorage":true}); //13
	items.push({"name":"invisibility potion","price":0,"owned":0,"plural":"s","showstorage":true});
	items.push({"name":"instant countdown potion","price":0,"owned":0,"plural":"s","showstorage":true});
	items.push({"name":"gambler's potion","price":0,"owned":0,"plural":"s","showstorage":true}); //16
	items.push({"name":"cookie potion","price":0,"owned":0,"plural":"s","showstorage":true}); //17
	items.push({"name":"X potion","price":0,"owned":0,"plural":"s","showstorage":true}); //18
	items.push({"name":"cookie","price":0,"owned":0,"plural":"s","showstorage":true}); //19
	items.push({"name":"secret potion","price":0,"owned":0,"plural":"s","showstorage":true}); //20
	items.push({"name":"key","price":0,"owned":0,"plural":"s","showstorage":true}); //21
	items.push({"name":"emerald sword","price":0,"owned":0,"plural":"s","showstorage":false}); //22
	items.push({"name":"music disc","price":0,"owned":0,"plural":"s","showstorage":true}); //23
	items.push({"name":"glasses","price":0,"owned":0,"plural":"s","showstorage":false}); //24
	items.push({"name":"shuriken","price":0,"owned":0,"plural":"s","showstorage":true}); //25
	items.push({"name":"berserk potion","price":0,"owned":0,"plural":"s","showstorage":true}); //26
	swords=[];
	swords.push({"name":"wooden sword","power":5});
	swords.push({"name":"stone sword","power":10});
	swords.push({"name":"iron sword","power":15});
	swords.push({"name":"diamond sword","power":20});
	swords.push({"name":"emerald sword","power":30});

	enchant_attack=0; //0
	enchant_defense=0; //deprecated :o
	enchant_countdown=0; //0
	enchant_life=0; //0

	helmet=0;
	chestplate=0;
	pants=0;
	boots=0;

	theusername="You";
	theuserdesc="This is you.";

	cipherstep=0;
	cheststep=0;
	searchtimes=0;
	shovelbroken=0;
	cursor=0;
	pizzaeaten=false;
	poisoned=false;
	chestunderground=false;
	talk=0;
	wob=false;
	buyfactory=false; //false
	skill="none"; //"none"
    skilllvl=0; //0
	additionalattack=0;
	clickcloudcount=0;
	openchestcount=0;
	candybox=false;
	hpactive=0;
	airplanecountdown=999999999; //999999999
	digcountdown=999999999;
	digstep=0;
	currentsword="none"; //"none"
	passthief=false; //false
	passworms=false; //false
	passgate=false; //false
	unlockenchant=false; //false
	unlockchest=false; //false
	beatboss=false; //false
	hasairplane=false; //false
	reachedclouds=false; //false
	defeatinvisiblebot=false; //false
	gethole=false;
	win=false;
	hasportal=false;
	activatemachine=false;
	autosave=true;
	autosavetime=30;
	autoattack=false;
	weapontype="Sword";
	endlesswave=0;
	ovenlevel=0;
	offhand="none";
	shieldlevel=0;
	if(localStorage.thegoldfactorygamesave) {
		dosave('loadlocalstorage');
	}

	setInterval(function() {
		if(autosave) {
			autosavetime--;
			$("#autosavetime").html(autosavetime);
			if(autosavetime==0) {
				autosavetime=30;
				dosave('autolocalstorage');
			}
		}
	},1000);

	asdasdf=digstep;
	digstep=0;
	for(i=0;i<asdasdf;i++) {
		dig(false,true);
	}

	if(airplanecountdown<=30) {
		flyingabcd=setInterval(function(){airplanecountdown--;},60000);
	}
	if(digcountdown<=100) {
		digabcd=setInterval(function(){digcountdown--;},60000);
	}

	$("#gold-factory").click(function() {
		if(!buyfactory) {
			closemessage();
			makealert("buy-factory","The Gold Factory","Status: You work here, and you get 1 gold bar per second as your salary.<br><br><input type=\"button\" value=\"Make the boss happier\" onclick=\"makebosshappy()\" class=\"mediumbutton\">and receive a bonus!<br><input type=\"button\" value=\"Buy this factory\" onclick=\"buythefactory()\" class=\"buy-factory-button mediumbutton\">for 2,500 gold bars and get more bars per second!",true);
			checkitem();
		}
		else {
			closemessage();
			makealert("buy-factory-new","The Gold Factory","Status: You are the boss! :o<br><br>You currently have <span class=\"gold-mining\">"+goldmining+"</span> mining machines.<br>Production: <span class=\"gbps\">"+gbps+"</span> gold bars / second<br><br><input type=\"button\" value=\"Buy 1 mining machine\" onclick=\"buyminingmachinegold(1)\" class=\"buy-1-mining-gold bigbutton\"> (<span class=\"1-gold-cost\">"+goldprice+"</span> Iron Bars)<br><input type=\"button\" value=\"Buy 10 mining machines\" onclick=\"buyminingmachinegold(10)\" class=\"buy-10-mining-gold bigbutton\"> (<span class=\"10-gold-cost\">"+calculateTotalPrice(goldmining, 10, golddivisor)+"</span> Iron Bars)<br><input type=\"button\" value=\"Buy 100 mining machines\" onclick=\"buyminingmachinegold(100)\" class=\"buy-100-mining-gold bigbutton\"> (<span class=\"100-gold-cost\">"+calculateTotalPrice(goldmining, 100, golddivisor)+"</span> Iron Bars)<br><br>Don't worry, the total's the same no matter how many you buy at once!<br>You can also <input type='button' value='kill rats' onclick='killrats()'>or <input type='button' value='decipher codes' onclick='ciphercode()'>.",true);
			checkitem();
		}
	});
	$(".theshop").click(function() {
		closemessage();
		$(".alert-theshop").fadeIn("fast");
		$(".modal").show();
	});
	$(".anothershop").click(function() {
		closemessage();
		$(".alert-anothershop").fadeIn("fast");
		$(".modal").show();
	});
	$(".sign").click(function() {
		if(!passthief) {
			closemessage();
			$(".alert-sign").fadeIn("fast");
			$(".modal").show();
		}
	});
	$(".dig-step-1").click(function() {
		if(passthief && !passworms) {
			closemessage();
			$(".alert-dig-step-1").fadeIn("fast");
			$(".modal").show();
		}
	});
	$(".training-center").click(function() {
		if(passworms) {
			closemessage();
			if(skill!="none") {
				makealert("training-center","Training Center","Welcome to the training center!<br>Here, you can test your abilities or learn a new one.<br><br><input type=\"button\" value=\"Test your skill\" onclick=\"testskill()\" class=\"training-button mediumbutton\"> (100 Gold Bars)<br><input type=\"button\" value=\"Upgrade your skill\" onclick=\"upgradeskill()\" class=\"upgrade-skill mediumbutton\">",true)
			}
			else {
				makealert("training-center","Training Center","Welcome to the training center!<br>Here, you can test your abilities or learn a new one.<br><br><input type=\"button\" value=\"Test your skill\" onclick=\"testskill()\" class=\"training-button mediumbutton\"> (100 Gold Bars)<br><input type=\"button\" value=\"Learn a new skill\" onclick=\"learnnewskill()\" class=\"new-skill mediumbutton\">",true)
			}
		}
	});
	$(".mining").click(function() {
		if(passworms) {
			closemessage();
			irontime=second2name(ibtime);
			makealert("mining","Iron Mine","This iron mine allows you to get iron bars automatically!<br><br>You currently have <span class=\"iron-mining-amount\">"+ironmining+"</span> mining machines.<br>Production: <span class=\"ibpt\">"+ibpt+"</span> iron bar(s) / <span class=\"irontime\">"+irontime+"</span><br><br><input type=\"button\" value=\"Buy 1 mining machine\" onclick=\"buyminingmachine(1)\" class=\"buy-1-mining bigbutton\"> (<span class=\"1-iron-cost\">"+ironprice+"</span> Gold Bars)<br><input type=\"button\" value=\"Buy 10 mining machines\" onclick=\"buyminingmachine(10)\" class=\"buy-10-mining bigbutton\"> (<span class=\"10-iron-cost\">"+calculateTotalPrice(ironmining, 10, irondivisor)+"</span> Gold Bars)<br><input type=\"button\" value=\"Buy 100 mining machines\" onclick=\"buyminingmachine(100)\" class=\"buy-100-mining bigbutton\"> (<span class=\"100-iron-cost\">"+calculateTotalPrice(ironmining, 100, irondivisor)+"</span> Gold Bars)<br><br>Don't worry, the total's the same no matter how many you buy at once!<br>You can also <input type='button' value='kill iron golems' onclick='killgolems()'>for extra iron bars.",true);
			checkitem();
		}
	});
	$(".gate").click(function() {
		if(passthief&&!passgate) {
			closemessage();
			makealert("locked-gate","Locked Gate","This gate is locked. You probably need a key to unlock it.<br><br><input type=\"button\" value=\"Make a key and unlock the gate\" onclick=\"makekey()\" class=\"make-key bigbutton\"> (100 Iron Bars)",true)
		}
	});
	$(".enchant").click(function() {
		if(passgate&&!unlockenchant) {
			closemessage();
			powerhp();
			battle=makebattle(battleid,"Monster",150,150,"Spatula??",15,"A monster",3,power,hp,hp,currentsword,false,"vs-monster");
			html="<div class=\"alert alert-battle-monster\"><b>Monster!</b><br>There is a dangerous monster in the enchanting shop!<br><br>"+battle.html+"</div>";
			$("#otheralerts").append(html);
			battle.init();
			$(".alert-battle-monster:last").fadeIn("fast");
		}
		else if(passgate&&unlockenchant) {
			closemessage();
			makealert("enchant-shop","Enchanting Shop","Welcome to the enchanting shop! Here, you can enchant your sword.<br>Be careful, as buying an enchantment makes all others a bit more expensive!<br><br><span class=\"enchants\"></span><br><div class='enchant-sword-attack'><input type=\"button\" value=\"Attack 1\" onclick=\"enchantsword('attack')\" class=\"button-enchant-attack smallbutton\"> (<span class=\"enchant-attack-price\"></span> gold bars)</div><!--br><input type=\"button\" value=\"Defense 1\" onclick=\"enchantsword('defense')\" class=\"button-enchant-defense smallbutton\"> (<span class=\"enchant-defense-price\"></span> gold bars)--><div class='enchant-sword-countdown'><input type=\"button\" value=\"Countdown 1\" onclick=\"enchantsword('countdown')\" class=\"button-enchant-countdown smallbutton\"> <span class='enchant-countdown-price-whole'>(<span class=\"enchant-countdown-price\"></span> gold bars)</span><span class='enchant-sword-countdown-max'>Attack speed maxed!</span></div><div class='enchant-sword-life'><input type=\"button\" value=\"Life 1\" onclick=\"enchantsword('life')\" class=\"button-enchant-life smallbutton\"> (<span class=\"enchant-life-price\"></span> gold bars)</div><br><input type=\"button\" value=\"Reset\" onclick=\"respec()\" class=\"button-respec smallbutton\"><br><br>Or, you can <input type=\"button\" value=\"visit the armor section\" onclick=\"armorshop()\" class=\"button-armor-shop\">of the shop.",true)
			checkthings();
		}
	});
	$(".chest").click(function() {
		if(passgate&&!unlockchest) {
			closemessage();
			powerhp();
			battle=makebattle(battleid,"Ghost",400,400,"Invisible hands",25,"This ghost is guarding the chest.",4,power,hp,hp,currentsword,false,"vs-ghost");
			html="<div class=\"alert alert-battle-ghost\"><b>Ghost</b><br>The chest is guarded by a ghost!<br><br>"+battle.html+"</div>";
			$("#otheralerts").append(html);
			battle.init();
			$(".alert-battle-ghost:last").fadeIn("fast");
		}
		else if(passgate&&unlockchest) {
			openchestcount++;
			closemessage();
			if(openchestcount==1) {
				message="The chest is empty now.";
			}
			else if(openchestcount==2) {
				message="The chest is empty now, told ya before!";
			}
			else if(openchestcount==3) {
				message="THE CHEST IS EMPTY!!!!!";
			}
			else if(openchestcount==4) {
				message="PLEASE BELIEVE ME!!!";
			}
			else if(openchestcount==5) {
				message="I've told you! AGAIN!";
			}
			else if(openchestcount==6) {
				message="Now I hate you.";
			}
			else if(openchestcount==7) {
				message="Oh, no, sorry, the chest is <b>not</b> empty. There are 1,000 gold bars hidden inside the chest. :D";
				goldbar+=1000;
			}
			else if(openchestcount>=8) {
				message="The chest is empty now. For real.";
			}
			$(".alert-chest-empty").remove();
			makealert("chest-empty","Empty",message,true);
		}
	});
	$(".phone").click(function(){
		let phonemessage = "There are no tips or hints that We™ can offer at the moment. Sorry!";
		if(items[7].owned < 3 && !beatboss) { 
			phonemessage = "If you want to succeed in combat, you <i>need</i> a good supply of Health Potions. Trust Us™ on this one.";
		}
		else if(items[3].owned < 100) {
			phonemessage = "You should totally eat more pizza. Why? Because it's good for your health, of course!";
		}
		else if(additionalattack < 1 && !beatboss) {
			phonemessage = "Testing your skills at the training center is not just for show - successfully defeating the robot also makes you slightly stronger! The effect is temporary, though, so watch out for that!";
		}
		else if(digstep == 0) {
			phonemessage = "The underground world is a lot larger than you'd expect! There's still so much more to find, so get digging!";
		}
		else if(ironmining < 196) {
			phonemessage = "Trust Us™ when we say that iron is an awesome metal. You should definitely be mining more! It will be very important later.";
		}
		else if(beatboss && !activatemachine && items[10] < 1) {
			phonemessage = "Have you made any potions yet? They should be pretty helpful!";
		}
		else if(reachedclouds && items[24].owned == 0) { 
			phonemessage = "Technology sure is amazing, isn't it? You should probably check the computer more closely. Who knows what you could find?";
		}
		else if(gethole && !win) {
			phonemessage = "This is it, the ultimate battle! We™'ll be honest, We™ didn't expect you to get this far. But you can't give up now! Use your skills and potions wisely, and you've got this!";
		}
		makealert("phone-alert","Ring™, ring™, ring™!","Hello, and thank you for calling the International Hint Hotline™!<br>Whether you need help or just want some tips, feel free to give Us™ a call!<br><br>"+phonemessage,true);
	});
	$(".castle").click(function() {

		if(!beatboss) {
			entercastle();
		}
		else {
			makealert("weapon-forge","The Zombie Forge","Welcome to our forge! Here, we can modify your weapon into a different one.<br><br><input type='button' value='Forge a spear' class='spear-button mediumbutton' onclick='reforge(\"Spear\")'>Very nimble, but not as strong. (500 Iron Bars)<br><input type='button' value='Forge a sword' class='sword-button mediumbutton' onclick='reforge(\"Sword\")'>A classic, balanced choice. (500 Iron Bars)<br><input type='button' value='Forge an axe' class='axe-button mediumbutton' onclick='reforge(\"Axe\")'>Very powerful, but rather slow. (500 Iron Bars)<br><input type='button' value='Forge a maul' class='maul-button mediumbutton' onclick='reforge(\"Maul\")'>The strongest. Needs both hands. (2500 Iron Bars)", true);
		}

	});
	$(".laboratory").click(function() {
		if(passgate) {

			makealert("laboratory","Laboratory","<div style='max-height:300px; overflow-y:auto;'><del title=\"No, I'm not CrazyRussianHacker\">What's up everybody, welcome back to my laboratory, where safety is number 1 priority!</del><br>In this laboratory, you can make potions from the resources you have. <br><a href='potions.html' target='_blank'>Potions Guide</a><br><br><input type=\"button\" value=\"Put\" class='smallbutton' onclick=\"putitem()\">&nbsp;<input type='number' id='quantity' placeholder='0' size='5' min='1'>&nbsp;<select id='itemlist'></select><br>Item(s) going to be mixed:<br><div id='goingtobemixed'></div><br><input type=\"button\" value=\"Mix!\" class='smallbutton' onclick=\"mixitems()\"><input type=\"button\" value=\"Take items out\" class='smallbutton' onclick=\"emptyCauldron()\"></div>",true);

			/*

				For future update, I guess

				makealert("laboratory","Laboratory","<div style='max-height:300px; overflow-y:auto;'><del title=\"No, i'm not CrazyRussianHacker\">What's up everybody, welcome back to my laboratory, safety is number 1 priority</del><br>In this laboratory, you can make potions and items from resources you have (<a href='lab.html' target='_blank'>Laboratory guide</a>)<br><br><input type=\"button\" value=\"Put\" onclick=\"putitem()\">&nbsp;<input type='text' id='quantity' placeholder='0' size='1'>&nbsp;<select id='itemlist'></select><br>Item(s) going to be mixed:<br><div id='goingtobemixed'></div><br><input type=\"button\" value=\"Mix!\" onclick=\"mixitems()\"></div>",true);

			*/

			thecauldron("make",0,0);
			updateitemlist();
		}
	});
	$(".portal").click(function() {
		if(passgate) {
			enterportal(1,"a");
		}
	});
	$(".airplane").click(function() {
		if(reachedclouds) {
		}
		else if(passgate&&!hasairplane) {
			makealert("buy-airplane","Airplane","This airplane is for sale.<br><br><input type=\"button\" value=\"Buy\" class=\"smallbutton\" onclick=\"buyairplane()\"> the airplane (50,000 iron bars)<br><i>99% off!</i>",true);
		}
		else if(passgate&&hasairplane&&airplanecountdown==999999999) {
			makealert("fly","Fly!!!","Are you ready to fly?<br><br><input type=\"button\" value=\"Fly now!\" class='smallbutton' onclick=\"fly()\">",true);
		}
		else if(passgate&&hasairplane&&airplanecountdown<=30) {
			makealert("fly-countdown","Fly!","Your plane is currently flying.<br>Time left: <span class='airplanecd'>"+airplanecountdown+" </span> minute(s) left.",true);
		}
	});
	$(".cloud-4").click(function() {
man="\n\
\n\
                              O\n\
                             /|\\\n\
                              |\n\
                             / \\";
		if(items[20].owned>0) {
			givesecretpotion="<input type=\"button\" value=\"Give him your secret potion\" onclick=\"theman('givesecretpotion');\" class='give-secret-potion bigbutton'>";
		}
		else {
			givesecretpotion="";
		}
		makealert("castle-clouds","The Castle","You enter the castle and see a man standing inside.<br><br><pre class='theman'>"+man+"</pre><br><br><input type=\"button\" value=\"Talk to him\" onclick=\"theman('talk');\" class='talk-with-dude bigbutton'><input type=\"button\" value=\"Fight with him\" onclick=\"theman('fight');\" class='fight-with-dude smallbutton'>"+givesecretpotion,true);
	});
	$(".small-hole").click(function() {
		if(digcountdown<=100) {
			dig(true,false);
		}
		else {
			if(digstep<5) {
				makealert("small-hole","A Small Hole","It seems that you can dig here.<br><br><input type=\"button\" value=\"Dig, dig, dig!\" class='smallbutton' onclick=\"dig(true,false)\"> (Make sure you have a shovel!)",true);
			}
		}
	});
	$(".nametag").click(function() {
		makealert("name-tag","Name Tag","You found a name tag!<br>You can now change your name and description in battles!<br><br>Name: <input type='text' id='yourname' value='"+theusername+"'><br>Description: <input type='text' id='yourdesc' value='"+theuserdesc+"'><br><br>WARNING: Inserting an extremely long name/description or adding some wild characters may corrupt your save file!",true);
		namedesc=setInterval(function() {
			theusername=$("#yourname").val();
			theuserdesc=$("#yourdesc").val();
		},100);
	});
	$(".chest-dig").click(function() {
		if(!chestunderground) {
chestascii='\n\
         __________\n\
        /\\____;;___\\\n\
       | /         /\n\
       `. ())oo() .\n\
        |\\(%()*^^()^\\\n\
       %| |-%-------|\n\
      % \\ | %  ))   |\n\
      %  \\|%________|\n\
       %%%%';
			makealert("chest-underground","Chest","The chest contained some useful resources and items!<br><br><pre>"+chestascii+"</pre>",true);
			goldbar+=1500;
			ironbar+=1000;
			items[7].owned+=5;
			chestunderground=true;
			checkthings();
		}
		else {
			makealert("chest-underground","Chest","The chest is empty. 100% sure.",true);
		}
	});
	$(".pizzas").click(function() {
		if(!pizzaeaten) {
			if(!pizzacollected) {
				makealert("pizza-alert","Pizza!","You found some old pizza ovens!<br>They seem like they could be useful, but unfortunately, they are broken.<br>You need 5,000 gold bars and 2,500 iron bars to repair them.<br><br><input type='button' value='Fix the ovens' class='smallbutton' onclick='eatpizza()'><br><br>The ovens also had 50 leftover pizzas in them, and a few old boxes lying around.",true);
				pizzacollected = true;
				items[3].owned += 50;
			}
			else {
				makealert("pizza-alert","Pizza!","You found some old pizza ovens!<br>They seem like they could be useful, but unfortunately, they are broken.<br>You need 5,000 gold bars and 2,500 iron bars to repair them.<br><br><input type='button' value='Fix the ovens' class='smallbutton' onclick='eatpizza()'>",true);
			}
		}
		else if(pizzaeaten) {
			makealert("pizza-alert","Pizza!","Your pizza ovens are diligently baking one pizza for you every 5 seconds.",true);
		}
	});
	$(".laptop").click(function() {
		makealert("cookieclicker","Cookie Clicker Lite™","Play the full game here: <a href='http://orteil.dashnet.org/cookieclicker/' target='_blank'>http://orteil.dashnet.org/cookieclicker/</a><br><br><span style='font-size:20px;'><span class='current-cookie'>"+items[19].owned+"</span> cookie(s)</span><br><span class='cps'>"+cursor/10+" </span> per second<br><br><input type=\"button\" value=\"Bake a cookie\" class='smallbutton' onclick=\"cookieclicker('bake')\"><br><br><span style='font-size:20px;'>Shop:</span><br><br><input type=\"button\" value=\"Cursor ["+cursor+"]\" onclick=\"alert('This is not the full version of Cookie Clicker, so you cannot buy cursors!')\" class='cursor-button smallbutton'> (<span class='cursor-price'>"+Math.round(15*Math.pow(1.15,cursor))+"</span> cookies)<br><!--input type=\"button\" value=\"Grandma [0]\" class='smallbutton' onclick=\"alert('This is not the full version of Cookie Clicker!')\"> (100 cookies)00-->",true);

		/*

			Actually I want to allow you guys to buy cursors,
			But when I implement it, i got some decimal digit issues like 99985.2000000000002 cookies

			ALso cursors' price can't be rounded using Math.round() dunno why, lol
			(Don't worry, I'll handle it. Someday.)
		*/

	});
	$(".sign-dig").click(function() {
		makealert("sign-underground-alert","A sign","\"This is the end of the tunnel. But maybe there will be updates in the future? Who knows!\"<br>You're not exactly sure what those \"updates\" are, but they seem important.<br><br>The secret of the ninja - 10 iron bars make a shuriken.",true);
	});
	$(".theportal").click(function() {
		exitmagicportal();
	});
	$(".thefox").click(function() {
		closemessage();
		powerhp();
		battle=makebattle(battleid,"The Fox",2000,2000,"Unknown",1,"A fox!",10,power,hp,hp,currentsword,false,"vs-fox");
		html="<div class=\"alert alert-battle-fox\"><b>The Fox</b><br>You choose to attack the fox. For some reason.<br><br>"+battle.html;
		$("#otheralerts").append(html);
		battle.init();
		$(".alert-battle-fox:last").fadeIn("fast");
	});
	$(".thehouse").click(function() {
computer="                                            _________________\n\
                                           |                 |\n\
                                           |   <span class=\"click\" onclick=\"computeraction('disc')\">___________</span>   |\n\
                                           |  <span class=\"click\" onclick=\"computeraction('disc')\">|   .....   |</span>  |\n\
 ______________________________________    |  <span class=\"click\" onclick=\"computeraction('disc')\">|___________|</span>  |\n\
|  __________________________________  |   |   ___________   |\n\
| |                                  | |   |  |   .....   |  |\n\
| |                                  | |   |  |___________|  |\n\
| |                                  | |   |   <span class=\"click\" onclick=\"computeraction('error')\">__</span>   __   _   |\n\
| |                                  | |   |  <span class=\"click\" onclick=\"computeraction('error')\">|__|</span> |__| |_|  |\n\
| |                                  | |   |                 |\n\
| |                                  | |   |                 |\n\
| |                                  | |   |                 |\n\
| |                                  | |   |                 |\n\
| |                                  | |   |       <span class=\"click\" onclick=\"computeraction('power')\">.|.</span>       |\n\
| |                                  | |   |      <span class=\"click\" onclick=\"computeraction('power')\">(   )</span>      |\n\
| |                                  | |   |       <span class=\"click\" onclick=\"computeraction('power')\">'-'</span>       |\n\
| |__________________________________| |   |                 |\n\
|______________________________________|   |                 |\n\
                 |    |      '.            |                 |\n\
                 |    |        '-.-'-.-'-.-|                 |\n\
                 )    (                    |                 |\n\
                /      \\                   |                 |\n\
               /________\\                  |_________________|";
		makealert("the-house-enter","The house","<div style='max-height:300px; width:538px; overflow-y:auto;'>You enter the house, and you see a computer in front of you...<br><br><pre class='computer-ascii'>"+computer+"</pre><div class='ylvis-the-fox'></div></div>",true);
	});
	$(".sand").click(function() {
		if(items[24].owned==1) {
			makealert("sand","Sand","There is a lot of sand here. You have no idea who put it here, if anyone did.<br><br><input type='button' value='Search for stuff!' class='bigbutton' onclick='searchsand()'> <span class='search-result'></span><br><input type='button' value='Bury yourself in the sand!' class='bigbutton' onclick='burysand()'>",true);
		}
		else {
			makealert("sand","Sand","There is a lot of sand here. You have no idea who put it here, if anyone did.<br>You can't see anything interesting inside the sand. Maybe if you had something to help you see better...",true);
		}
	});
	$(".boss").click(function() {
		if(!win) {
story="\n\
\n\
       _\n\
   .&bull;'   '&bull;.    \"Who is standing there?               O\n\
  /         \\    Hmmmm... That's weird...\"           /|\\\n\
 |           |                                        |\n\
 |           |                                       / \\\n\
  \\         /    <input type='button' value='Next >' onclick='guy(1)'>                              \n\
   '&bull;.   .&bull;'\n\
     /   \\\n\
    / | | \\\n\
   / /| |\\ \\\n\
  / / | | \\ \\\n\
";
			makealert("boss-conversation","Someone","Someone is standing there...<br><br><pre class='boss-story'>"+story+"</pre>",true);
		}
		else {
			makealert("chest-from-boss","Chest","There is a chest here.<br><br><input type='button' class='mediumbutton' onclick='openthechestfromsomeone()' value='Interact with the chest'>",true);
		}
	});
	$(".old-machine").click(function() {
		if(activatemachine) {
			makealert("old-machine","An Old Machine","The machine has a single slot and only one instruction: 'INSERT BARS'. You don't really know what it does, but hey, maybe it could be useful!<br><br><input type='button' value='Put 1,000 gold bars inside the machine' onclick='givemachinegoldbar(1000)' class='hugebutton'><br><input type='button' value='Put 10,000 gold bars inside the machine' onclick='givemachinegoldbar(10000)' class='hugebutton'><br><input type='button' value='Put 100,000 gold bars inside the machine' onclick='givemachinegoldbar(100000)' class='hugebutton'><br><br><input type='button' value='Put 1,000 iron bars inside the machine' onclick='givemachineironbar(1000)' class='hugebutton'><br><input type='button' value='Put 10,000 iron bars inside the machine' onclick='givemachineironbar(10000)' class='hugebutton'><br><input type='button' value='Put 100,000 iron bars inside the machine' onclick='givemachineironbar(100000)' class='hugebutton'>",true);
		}
		else {
			makealert("old-machine","An Old Machine","This old machine seems to need fuel, maybe a good old bucket of lava could do the trick?<br><br><input type='button' value='Pour some lava in' class='mediumbutton' onclick='givelavabuckettothemachine()'>",true);
		}
	});
	$(".endlessgate").click(function() {
		makealert("endlessgate-intro", "The Gate of Endless Glory", "Welcome to the Gate of Endless Glory!<br>Fight through waves of other tough warriors to ascend the ranks!<br>Have you got what it takes to become the Glorious Champion?<br><br>You have made it through "+endlesswave.toLocaleString("en")+" waves.<br> This gives you "+endlesswave.toLocaleString("en")+"% more gold from The Gold Factory.<br><br>You are currently in the Wooden Rat league.<br>This gives you "+Math.floor(endlesswave/5).toLocaleString("en")+"% more iron from the iron mine.<br><br><input type='button' value='Fight!' onclick='endlessgate()' class='mediumbutton'>", true);
	});
	let ironTimer = 0;
	let goldTimer = 0;
	let pizzaTimer = 0;

	let lastTime = Date.now();

	function gameLoop() {
		const now = Date.now();
		const delta = (now - lastTime) / 1000;
		lastTime = now;

		ironTimer += delta;
		goldTimer += delta;
		pizzaTimer += delta;

		if (ironTimer >= ibtime) {
			let ironCycles = Math.floor(ironTimer / ibtime);
			ironbar += Math.floor((ironCycles * ibpt) * (1 + Math.floor(endlesswave/5)/100));
			ironTimer -= ironCycles * ibtime;
		}

		if (goldTimer >= 1) {
			let goldCycles = Math.floor(goldTimer);
			goldbar += Math.floor((goldCycles * gbps) * (1 + endlesswave/100));
			goldTimer -= goldCycles;
		}

		if (pizzaTimer >= 5) {
			let pizzaCycles = Math.floor(pizzaTimer / 5);
			if(pizzaeaten) {
				items[3].owned += pizzaCycles;
			}
			pizzaTimer -= pizzaCycles * 5;
		}

		checkthings();
		requestAnimationFrame(gameLoop);
	}
	const offhandSelect = document.getElementById("offhands");
		offhandSelect.addEventListener("change", (event) => {
		if(weapontype != "Maul"){
      		offhand = event.target.value;
		}
    });
	gameLoop();
});
function checkthings() {
	powerhp();
	updategold();
	checkbuilding();
	updateitems();
	checkitem();
	updatestatus();
	if(wob) {
		$('body').addClass("wob");
	}
	else {
		$('body').removeClass("wob");
	}
}
function makealert(id,title,text,show) {
	$(".alert-"+id).remove();
	html="<div class=\"alert alert-"+id+"\"><b>"+title+"</b><br>"+text+"<div class=\"close-message-button-"+id+"\"><br><input type=\"button\" value=\"Close this window\" onclick=\"closemessage()\" class='button-close-window-"+id+" mediumbutton'></div></div>";
	$("#otheralerts").append(html);
	if(show) {
		closemessage();
		$(".alert-"+id).fadeIn("fast");
		$(".modal").show();
	}
}
function givemachinegoldbar(howmany) {
	if(howmany%10==0) {
		if(goldbar>=howmany) {
			goldbar-=howmany;
			howmany/=4;
			ironbar+=howmany;
			checkthings();
			alert('The machine gave you '+howmany.toLocaleString("en")+' iron bar(s)!');
		}
		else {
			alert('Not enough gold bars!');
		}
	}
}
function givemachineironbar(howmany) {
	if(howmany%10==0) {
		if(ironbar>=howmany) {
			ironbar-=howmany;
			howmany/=4;
			goldbar+=howmany;
			checkthings();
			alert('The machine gave you '+howmany.toLocaleString("en")+' gold bar(s)!');
		}
		else {
			alert('Not enough iron bars!');
		}
	}
}
function givelavabuckettothemachine() {
	if(!activatemachine) {
		if(items[10].owned>=1) {
			items[10].owned-=1;
			activatemachine=true;
			makealert("lava-success","It works!","You have successfully powered the machine up!",true);
		}
		else {
			alert('You have no lava!');
		}
	}
}
function clickcloud() {
	clickcloudcount++;
	if(clickcloudcount==10) {
		goldbar+=1000;
		makealert("falling-gold","Gold!","1,000 gold bars just fell from the sky!",true);
		checkthings();
	}
}
function powerhp() {
	for(i=0;i<swords.length;i++) {
		thissword=swords[i];
		if(currentsword.toLowerCase()==thissword.name) {
			power=thissword.power+additionalattack;
			basepower=thissword.power+additionalattack;
			break;
		}
		else{
			power=0;
			basepower=0;
		}
	}
	power+=enchant_attack*7;
	basepower+=enchant_attack*7;
	if(weapontype == "Spear"){
		power = Math.round(power*0.7);
	}
	if(weapontype == "Axe"){
		power = Math.round(power*1.3);
	}
	if(weapontype == "Maul"){
		power = Math.round(power*2);
	}
	hp=100;
	hp+=Math.floor(items[3].owned/3.5);
	thisismyhp=100;
	thisismyhp+=Math.floor(items[3].owned/3.5);
	attackspeed = (1000 - enchant_countdown*100)
	if(weapontype == "Spear") {
		attackspeed = Math.round(attackspeed * 0.8);
	}
	if(weapontype == "Axe") {
		attackspeed = Math.round(attackspeed * 1.2);
	}
	if(weapontype == "Maul") {
		attackspeed = Math.round(attackspeed * 1.5);
	}
	if(offhand == "Watch") {
		attackspeed = Math.round(attackspeed * 0.95);
	}
}
function testskill() {
	if(goldbar>=100) {
		goldbar-=100;
		checkthings();
		powerhp();
		hpdivide10=Math.ceil(hp/10);
		closemessage();
		battle=makebattle(battleid,"Training Robot",hp+hpdivide10,hp+hpdivide10,"Short ranged laser!",basepower+Math.ceil(basepower/10),"A training robot",2,power,hp,hp,currentsword,false,"training");
		html="<div class=\"alert alert-training\"><b>Test your skill!</b><br>Let's see how strong you are!<br><br>"+battle.html+"</div>";
		$("#otheralerts").append(html);
		battle.init();
		$(".alert-training:last").fadeIn("fast");
	}
}
function showcredits() {
	closemessage();
	makealert("credits","Credits","<div style='max-height:300px; overflow-y:auto;'>Shark ASCII art by Tom Youderian<br>Phone ASCII art by an unknown artist<br><br><b>---ORIGINAL CREDITS BELOW---</b><br><br>Ascii arts:<br><br>Factory, house, thunder, monster, castle, chest,<br>ghost, airplane, microscope, scroll, fox, rat:<br><a href='http://www.retrojunkie.com/asciiart/asciiart.htm' target='_blank'>http://www.retrojunkie.com/asciiart/asciiart.htm</a> (with a little modification)<br><hr>Cloud:<br><a href='http://www.geocities.com/spunk1111/nature.htm#clouds' target='_blank'>http://www.geocities.com/spunk1111/nature.htm#clouds</a><br>(taken from a \"landscape\")<br><hr>Computer:<br>aniwey (from Candy Box 2)<br><hr>Banner plane:<br><a href='http://www.asciiworld.com/-Planes-.html' target='_blank'>http://www.asciiworld.com/-Planes-.html</a> (with a little modification)<hr>Some other ascii arts are created by me :D<br><br><br>Inspired by:<br>The \"legendary\" <a href='http://candies.aniwey.net' target='_blank' onclick='candybox=true'>Candy Box</a> game<br>and <a href='http://adarkroom.doublespeakgames.net' target='_blank'>A Dark Room</a><br>and also <a href='http://candybox2.net' target='_blank' onclick='candybox=true'>Candy Box 2</a><br><br>Thanks to<br>Minecraft for the \"names\", enchanting, and some others :D<br><br>Also special thanks to:<br>- Redditors, people from cb2 forum, people from jayisgames.com for the bug reports, suggestions and critics<br>- Also thanks to <a href='https://github.com/gamehelp16/thegoldfactory/graphs/contributors' target='_blank'>several people</a> who have contributed to the game!</div>",true)
}
function showetc() {
	closemessage();
	makealert("etc","Etc.","<div style='max-height:300px; overflow-y:auto;'>I don't know what name is good for this part, so i just give the name \"etc\" :D<br><br>If there are some bugs, glitches, suggestions, etc., you can contact me via: <a href=\"http://reddit.com/r/thegoldfactory\" target='_blank'>reddit</a><br>If you like this game, feel free to share it<br>.. and don't forget to <a href='http://github.com/gamehelp16/thegoldfactory' target='_blank'>view the repo</a> on GitHub!<br><br><i>\"The awkward moment when you need gold to buy wooden sword and you can't make a butter sword by yourself\"</i><br><br>...and sorry if my English is bad XD<br><br><small><a href='javascript:alert(\"why was this even in the game\")' style='color:white;' title='Dont click me, pls'>headache mode</a></small></div>",true)
}
function toggle() {
	if(wob) {
		wob=false;
	}
	else {
		wob=true;
	}
	checkthings();
}
function showbugs() {
	closemessage();
	makealert("bugs","Known Bugs & Glitches","<div style='max-height:300px; overflow-y:auto;'>After battling, please wait for around 5 seconds before battling again, or you might instantly die.<br/>This never actually happened to me, but this warning was in the original game, so I'm keeping it here.",true)
}

function showdec2021msg() {
	closemessage();
	makealert("dec2021msg","Message from the Developer (December 2021)","<div style='max-height:300px; overflow-y:auto;'>Hi! If you're reading this I just would like to thank you for playing this game up until now, honestly I didn't expect that this game still has quite a lot of players even 7+ years after its release!<br><br>I've received several messages from you guys asking if there are going to be new updates/content in this game so I'm going to use this opportunity to say that as of now I have no plans to update this game anymore. However, having said that I recently updated this game to improve some styling and made some minor updates!<br><br>If you enjoyed this game you can check out several other games I have made in the past:<ul><li><a href='https://gamehelp16.github.io/chickens/' target='_blank'>Chickens!</a></li><li><a href='https://gamehelp16.github.io/world-warper-ld30/' target='_blank'>World Warper</a></li><li><a href='https://gamehelp16.github.io/the-unconventional-weapon/' target='_blank'>The Unconventional Weapon</a></li><li><a href='https://gamehelp16.github.io/material-warrior/' target='_blank'>Material Warrior</a></li><li><a href='https://gamehelp16.github.io/which-subreddit/' target='_blank'>Which Subreddit?</a></li></ul>You can also check out this <a href='https://gamehelp16.github.io/post/welcome/' target='_blank'>blog post I made</a> where I list some other things that I have created just in case you're curious. It just feels amazing knowing that there people who are still playing something I made many years ago, so once again thank <i>you</i>! :) <br><br><i>And thank you for making this amazing game! -voxelbugged</i></div>",true)
}
function dighole() {
	if(items[2].owned==0) {
		makealert("attacked","Attacked!","While you are digging the hole, someone suddenly runs towards you and tries to attack you!<br>You can't fight back, so you run away...",true);
	}
	else {
		powerhp();
		closemessage();
		battle=makebattle(battleid,"Thief",100,100,"Thief's Dagger",3,"A thief, nothing else.",0,power,hp,hp,currentsword,false,"vs-thief");
		html="<div class=\"alert alert-battle1\"><b>Attacked!</b><br>While you are digging the hole, someone suddenly runs towards you and attacks you!<br><br>"+battle.html+"</div>";
		$("#otheralerts").append(html);
		battle.init();
		$(".alert-battle1:last").fadeIn("fast");
	}
}
function continuedigging() {
	closemessage();
	powerhp();
	battle=makebattle(battleid,"Worms",80,80,"Their body",15,"Worms!",1,power,hp,hp,currentsword,false,"vs-worms");
	html="<div class=\"alert alert-battle2\"><b>Worms! :o</b><br>There are worms under the ground!<br>They seem to be mad that you destroyed their home...<br><br>"+battle.html+"</div>";
	$("#otheralerts").append(html);
	battle.init();
	$(".alert-battle2:last").fadeIn("fast");
}
function second2name(second) {
	if(second==1) {
		return "second";
	}
	else if(second==60) {
		return "minute";
	}
	else if(second==3600) {
		return "hour";
	}
}
function makekey() {
	if(ironbar>=100) {
		ironbar-=100;
		passgate=true;
		closemessage();
		checkthings();
	}
}
function learnnewskill() {
	closemessage();
	makealert("choose-skill","Choose a skill","Pick the skill that you want to learn.<br>Choose wisely, because changing it is expensive!<br><br><input type=\"button\" class='mediumbutton' value=\"Thunder Bolt\" onclick=\"chooseskill(1)\"><br><input type=\"button\" value=\"Invulnerability\" class='mediumbutton' onclick=\"chooseskill(2)\">",true)
}
function chooseskill(type) {
	closemessage();
	if(type==1) {
		skill="thunder";
		makealert("get-skill","Thunder Bolt","You can now upgrade this skill in the training center!",true)
	}
	else {
		skill="invuln";
		makealert("get-skill","Invulnerability","You can now upgrade this skill in the training center!",true)
	}
}
function upgradeskill() {
	if(skill=="thunder") {
		makealert("upgrade-skill","Upgrade Skill","Your skill is: Thunder Bolt<br>Skill level: <span class=\"skilllvl\">"+skilllvl+"</span> (<span class=\"thunder-damage\">"+(20+skilllvl*10)+"</span> damage)<br><br><input type=\"button\" class='mediumbutton' value=\"Upgrade this skill\" onclick=\"doupgrade()\"> (<span class=\"upgrade-price\">"+(skilllvl*skilllvl*500+500)+"</span> gold bars)<br><input type=\"button\" class='mediumbutton' value=\"Change your skill\" onclick=\"changeskill()\"> (<span class=\"change-price\">"+(skilllvl*skilllvl*250+250)+"</span> gold bars)",true);
	}
	else {
		makealert("upgrade-skill","Upgrade Skill","Your skill is: Invulnerability<br>Skill level: <span class=\"skilllvl\">"+skilllvl+"</span> (<span class=\"invuln-time\">"+(3+skilllvl)+"</span> second(s))<br><br><input type=\"button\" class='mediumbutton' value=\"Upgrade this skill\" onclick=\"doupgrade()\"> (<span class=\"upgrade-price\">"+(skilllvl*skilllvl*500+500)+"</span> gold bars)<br><input type=\"button\" class='mediumbutton' value=\"Change your skill\" onclick=\"changeskill()\"> (<span class=\"change-price\">"+(skilllvl*skilllvl*250+250)+"</span> gold bars)",true);
	}
}
function doupgrade() {
	cost=(skilllvl*skilllvl*500+500);
	if (goldbar>=cost) {
		goldbar-=cost;
		skilllvl++;
		checkthings();
	}
}
function changeskill()
{
	cost=(skilllvl*skilllvl*250+250);
	if (goldbar>=cost) {
		goldbar-=cost;
		if(skill=="thunder") {
			chooseskill(2);
		}
		else
		{
			chooseskill(1);
		}
		checkthings();
	}
}
function buythefactory() {
	if(goldbar>=2500) {
		goldbar-=2500;
		gbps=3;
		goldmining=30;
		buyfactory=true;
		checkthings();
		closemessage();
	}
}
function readscroll() {
scroll='\n\
   _______________________\n\
 =(__    ___      __     _)=\n\
   |                     |\n\
   | How to make a       |\n\
   | nether portal:      |\n\
   |                     |\n\
   | 1. Get 14 obsidian  |\n\
   |    cubes            |\n\
   | 2. Arrange them so  |\n\
   |    they form a      |\n\
   |    frame            |\n\
   | 3. Walk through the |\n\
   |    frame            |\n\
   |                     |\n\
   |__    ___   __    ___|\n\
 =(_______________________)=\n\
';
	makealert("scroll","The ancient scroll","You read the ancient scroll, it says:<br><br><pre>"+scroll+"</pre>",true);
}
function entercastle() {
	closemessage();
	powerhp();
	battle=makebattle(battleid,"Castle Guard",200,200,"Butter Sword!",30,"Guards the castle.",0,power,hp,hp,currentsword,false,"vs-castle-guard");
	html="<div class=\"alert alert-castle\"><b>Castle</b><br>You are entering the castle...<br><br><div class=\"castle-steps\"><span class=\"castle-entrance\">Castle Entrance</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"castle-hall\">Castle Hall</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"castle-room\">King's Room</span></div><br><br>"+battle.html+"</div>";
	$("#otheralerts").append(html);
	$(".castle-hall").addClass("grey");
	$(".castle-room").addClass("grey");
	battle.init();
	$(".alert-castle:last").fadeIn("fast");
}
function castlegotohall(myfinalhp) {
	powerhp();
	battle=makebattle(battleid,"Castle Staff",300,300,"Sword-like-knife",20,"The staff makes the castle look good.",0,power,myfinalhp,hp,currentsword,false,"vs-castle-staff");
	html="<div class=\"alert alert-castle-hall\"><b>Castle</b><br>You are inside the castle...<br><br><div class=\"castle-steps\"><span class=\"castle-entrance\">Castle Entrance</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"castle-hall\">Castle Hall</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"castle-room\">King's Room</span></div><br><br>"+battle.html+"</div>";
	$("#otheralerts").append(html);
	$(".castle-entrance").addClass("grey");
	$(".castle-room").addClass("grey");
	battle.init();
	$(".alert-castle-hall:last").fadeIn("fast");
}
function castlegotoking(myfinalhp) {
	powerhp();
	battle=makebattle(battleid,"Zombie King",500,500,"Diamond Sword",40,"I AM THE BOSS!!",0,power,myfinalhp,hp,currentsword,false,"vs-castle-boss");
	html="<div class=\"alert alert-castle-king\"><b>Castle</b><br>You are in front of the king! :o<br><br><div class=\"castle-steps\"><span class=\"castle-entrance\">Castle Entrance</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"castle-hall\">Castle Hall</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"castle-room\">King's Room</span></div><br><br>"+battle.html+"</div>";
	$("#otheralerts").append(html);
	$(".castle-entrance").addClass("grey");
	$(".castle-hall").addClass("grey");
	battle.init();
	$(".alert-castle-king:last").fadeIn("fast");
}
function buyairplane() {
	if(ironbar>=50000) {
		ironbar-=50000;
		checkthings();
		hasairplane=true;
		makealert("get-airplane","You have an airplane now!","The airplane is now yours! Someone left their suitcase here, too.<br><br>You got a new offhand item - the Strange Suitcase!</pre>",true);
	}
}
function fly() {
	airplanecountdown=5;
	flyingabcd=setInterval(function(){airplanecountdown--;},60000);
	closemessage();
}
function enterportal(step,thehp2) {

	totalprogress=20;
	progress="";

	for(i=1;i<=totalprogress;i++) {
		if(i==step) {
			if(candybox) {
				you="\\o/";
			}
			else {
				you="YOU";
			}
			progress=progress+you;
		}
		else {
			progress=progress+"___";
		}
	}

	$(".alert-nether").remove();
	closemessage();
	html="<div class=\"alert alert-nether\"><b>Nether!</b><br>Welcome to the nether!<br><pre>"+progress+"</pre><br><div id='nether-battle-area'></div></div>";
	$("#otheralerts").append(html);
	if(step==1) {
		$(".modal").show();
		$(".alert-nether").fadeIn("fast");
	}
	else {
		$(".alert-nether").show();
	}

	if(step<=totalprogress) {
		if(Math.random()<=0.25) {
			powerhp();
			therand=randomnumber(1,8);
			maxhp=hp;
			if(thehp2!="a") {
				hp=thehp2;
			}
			if(therand==1) {
				battle=makebattle(battleid,"Monster",250,250,"Spatula??",35,"A monster!",3,power,hp,maxhp,currentsword,false,"in-the-nether-"+step);
			}
			else if(therand==2) {
				battle=makebattle(battleid,"Ghost",350,350,"Invisible hands",25,"A Ghost, nothing else.",4,power,hp,maxhp,currentsword,false,"in-the-nether-"+step);
			}
			else if(therand==3) {
				battle=makebattle(battleid,"Giant",650,650,"Big hand",15,"Bam, bam, bam.",5,power,hp,maxhp,currentsword,false,"in-the-nether-"+step);
			}
			else if(therand==4) {
				battle=makebattle(battleid,"Unicorn",400,400,"Horn",30,"Unicorn!! Yay!!! :D",6,power,hp,maxhp,currentsword,false,"in-the-nether-"+step);
			}
			else if(therand==5) {
				battle=makebattle(battleid,"Wizard",150,150,"Spells",65,"Abrakadabra!",7,power,hp,maxhp,currentsword,false,"in-the-nether-"+step);
			}
			else if(therand==6) {
				battle=makebattle(battleid,"Pegasus",300,300,"Wings",40,"The Pegasus is facing the wrong direction :/",8,power,hp,maxhp,currentsword,false,"in-the-nether-"+step);
			}
			else {
				battle=makebattle(battleid,"Weakened Ghost",250,250,"Invisible hands",15,"A weakened ghost.",4,power,hp,maxhp,currentsword,false,"in-the-nether-"+step);
			}
			$("#nether-battle-area").html(battle.html);
			battle.init();
		}
		else {
			step++;
			setTimeout(function(){enterportal(step,thehp2);},500);
		}
	}
	else {
		powerhp();
		maxhp=hp;
		if(thehp2!="a") {
			hp=thehp2;
		}
		battle=makebattle(battleid,"The Devil",666,666,"Pitchfork",66,"Unholy moly!",3,power,hp,maxhp,currentsword,false,"vs-devil");
		$("#nether-battle-area").html(battle.html);
		battle.init();
	}

}
function showstorage() {
	closemessage();
	$(".alert-storage").fadeIn("fast");
	$(".modal").show();
}
function showequipment() {
	closemessage();
	$(".alert-equipment").fadeIn("fast");
	$(".modal").show();
	const offhandSelect = document.getElementById("offhands");
	const previousSelection = offhandSelect.value;

    offhandSelect.innerHTML = `<option value="none">Empty Hand</option>`;

    if (shieldlevel > 0) {
    	const shieldOption = document.createElement("option");
    	shieldOption.value = "Shield";
    	shieldOption.textContent = shieldnames[shieldlevel-1];
    	offhandSelect.appendChild(shieldOption);
    }
	if (passthief) {
		const daggerOption = document.createElement("option");
		daggerOption.value = "Dagger";
		daggerOption.textContent = "Thief's Dagger";
		offhandSelect.appendChild(daggerOption);
	}
	/*
	if (beatboss) {
		const totemOption = document.createElement("option");
		totemOption.value = "Totem";
		totemOption.textContent = "Totem of Undying";
		offhandSelect.appendChild(totemOption);
	}
	if (pizzaeaten) {
		const pizzaOption = document.createElement("option");
		pizzaOption.value = "Pizza";
		pizzaOption.textContent = "Pizza Box Shield";
		offhandSelect.appendChild(pizzaOption);
	}
	if (items[25].owned > 0) {
		const shurikensOption = document.createElement("option");
		shurikensOption.value = "Shurikens";
		shurikensOption.textContent = "Shurikens";
		offhandSelect.appendChild(shurikensOption);
	}
	*/
	if (hasairplane) {
		const suitcaseOption = document.createElement("option");
		suitcaseOption.value = "Suitcase";
		suitcaseOption.textContent = "Strange Suitcase";
		offhandSelect.appendChild(suitcaseOption);
	}
	if (win) {
		const watchOption = document.createElement("option");
		watchOption.value = "Watch";
		watchOption.textContent = "Professor's Watch";
		offhandSelect.appendChild(watchOption);
	}
	if ([...offhandSelect.options].some(opt => opt.value === previousSelection)) {
      offhandSelect.value = previousSelection;
    } else {
      offhandSelect.value = "none";
    }
}
function changelog() {
	closemessage();
	makealert("changelog","Beta Features",'<div style="max-height:300px;overflow-y:auto">Currently implemented:<br>- Iron Golems<br>- Enchanting rework<br>- Reforging your weapon at the castle<br>- Endless Gate (partially)<br>- New potion (Berserk)<br>- Offhand items<br><br>Not yet implemented (work started):<br>- Pizza oven upgrades<br><br>Not yet started (maybe postponed to 1.3.1):<br>- New boss and item<br>- More automation options<br>- UI reworks</div>',true);
}
function armorshop() {
	closemessage();
	makealert("armor-shop","Armor Section","We sell armor too! Buy some to absorb damage from your enemies!<br><br>Your stats: <span class=\'absorb-percent'>0</span>% damage absorbed<br><br><div class='helmet-area'><input type=\"button\" value=\"Buy a leather helmet\" onclick=\"buyarmor('helmet')\" class=\"button-buy-helmet mediumbutton\"> (<span class=\"buy-helmet-price\">0</span> gold bars)</div><div class='chestplate-area'><input type=\"button\" value=\"Buy a leather chestplate\" onclick=\"buyarmor('chestplate')\" class=\"button-buy-chestplate mediumbutton\"> (<span class=\"buy-chestplate-price\">0</span> gold bars)</div><div class='pants-area'><input type=\"button\" value=\"Buy a leather pants\" onclick=\"buyarmor('pants')\" class=\"button-buy-pants mediumbutton\"> (<span class=\"buy-pants-price\">0</span> gold bars)</div><div class='boots-area'><input type=\"button\" value=\"Buy a leather boots\" onclick=\"buyarmor('boots')\" class=\"button-buy-boots mediumbutton\"> (<span class=\"buy-boots-price\">0</span> gold bars)</div>",true)
	checkthings();
}
function buyarmor(armor) {
	if(armor=="helmet") {
		price=(helmet)*2000+1000;
	}
	else if(armor=="chestplate") {
		price=(chestplate)*2000+1000;
	}
	else if(armor=="pants") {
		price=(pants)*2000+1000;
	}
	else if(armor=="boots") {
		price=(boots)*2000+1000;
	}

	if(goldbar>=price) {
		goldbar-=price;
		if(armor=="helmet") {
			helmet+=1;
		}
		else if(armor=="chestplate") {
			chestplate+=2;
		}
		else if(armor=="pants") {
			pants+=1.5;
		}
		else if(armor=="boots") {
			boots+=0.5;
		}
	}
	checkthings();
}
function buyshield(price) {
	if (goldbar >= price){
		if(price > 1000 && shieldlevel < 2){
			return;
		}
		goldbar -= price;
		shieldlevel++;
		checkthings();
	}
}
function theman(action) {
man="\n\
                              O\n\
                             /|\\\n\
                              |\n\
                             / \\";
	if(action=="talk") {
		if(talk==0) {
man="\n\
           Hi, it seems       O\n\
           that you have     /|\\\n\
           spent a lot of     |\n\
           time to get here! / \\";

			$(".talk-with-dude").val("Yeah, it was a long journey...");
			$(".fight-with-dude").hide();
			$(".give-secret-potion").hide();
		}
		else if(talk==1) {
man="\n\
           How could I        O\n\
           help you?         /|\\\n\
                              |\n\
                             / \\";

			$(".talk-with-dude").val("I have no idea!");
			$(".fight-with-dude").hide();
			$(".give-secret-potion").hide();
		}
		else if(talk==2) {
man="\n\
           Oh, I know!        O      I'm interested in:\n\
           Please, tell me   /|\\     <input type=\"button\" value=\"Battle\" onclick=\"theman('battle')\">\n\
           what you are more  |      <input type=\"button\" value=\"Magic\" onclick=\"theman('magic')\">\n\
           interested in.    / \\";

		}

		if(talk!=2) {
			talk++;
		}
		else {
			talk=0;
			$(".talk-with-dude").val("Talk to him");
			$(".talk-with-dude").hide();
			$(".fight-with-dude").show();
			$(".give-secret-potion").show();
			if(items[20].owned<=0) {
				$(".give-secret-potion").hide();
			}
		}
		$(".theman").html(man);
	}
	else if(action=="fight") {
	randomspeech=randomnumber(1,8);
	randomspeech2=randomnumber(1,8);
if(randomspeech==1) {
man="\n\
            Ugh...            O\n\
            I hate fighting. /|\\\n\
                              |\n\
                             / \\";
}
else if(randomspeech==2) {
man="\n\
            Is fighting       O\n\
            the only hobby   /|\\\n\
            you have?         |\n\
                             / \\";
}
else if(randomspeech==3) {
man="\n\
            No, I'm           O\n\
            not ready!       /|\\\n\
                              |\n\
                             / \\";
}
else if(randomspeech==4) {
man="\n\
            Maybe you         O\n\
            would like       /|\\\n\
            to fight with     |\n\
            someone else?    / \\";
}
else if(randomspeech==5) {
man="\n\
            I'm not           O\n\
            equipped with    /|\\\n\
            armor and         |\n\
            weapons!         / \\";
}
else if(randomspeech==6) {
man="\n\
                              O\n\
            No, no pls       /|\\\n\
                              |\n\
                             / \\";
}
else if(randomspeech2==7) {
man="\n\
                              O\n\
            My name          /|\\\n\
            is Bob!           |\n\
                             / \\";
}
else  {
man="\n\
                              O\n\
            Not now...       /|\\\n\
                              |\n\
                             / \\";
}
		$(".theman").html(man);
		$(".talk-with-dude").val("Talk to him");
		$(".talk-with-dude").show();
		$(".fight-with-dude").show();
		$(".give-secret-potion").show();
		if(items[20].owned<=0) {
			$(".give-secret-potion").hide();
		}
	}
	else if(action=="battle") {
man="\n\
  Oh, so you like battle?     O   manages to defeat it will\n\
  I have an invisible        /|\\  get lots of prizes from\n\
  training robot in my        |   me. Are you ready?\n\
  castle! Anyone who         / \\  <input type=\"button\" value=\"Yes, I'm ready!\" onclick=\"vsinvisiblebot()\">";
		$(".theman").html(man);
	}
	else if(action=="magic") {
man="\n\
         There is a portal    O     portal seems\n\
         in my castle. I     /|\\    very magical.\n\
         have never entered   |     <input type=\"button\" value=\"Enter the portal!\" onclick=\"entermagicportal()\">\n\
         it before, but the  / \\";
		$(".theman").html(man);
	}
	else if(action=="givesecretpotion") {
		items[20].owned--;
		items[23].owned++;
man="\n\
         Oh, thank you!       O    this thing for years\n\
         As a reward, you    /|\\   but I don't know what\n\
         can have this music  |    it is used for. Maybe you\n\
         disc. I have kept   / \\   can use it better than me!";
		$(".theman").html(man);
		if(items[20].owned<=0) {
			$(".give-secret-potion").hide();
		}
	}
}
function eatpizza() {
		if(goldbar >= 5000 && ironbar >= 2500){
			goldbar -= 5000;
			ironbar -= 2500;
			makealert("ovens-fixed","Pizza!","You have successfully fixed the ovens!<br>They are now baking one pizza for you every 5 seconds.",true);
			checkthings();
			pizzaeaten=true;
		}
		else
		{
			makealert("ovens-not-fixed",'Pizza?',"You tried to fix the ovens, but you didn't have enough resources.", true);
		}
}
function healme() {
	if(items[7].owned>=10) {
		items[7].owned-=10;
		poisoned=false;
		makealert("drink-10-health-potion","Healed","You drank 10 health potions and now you are not posioned anymore",true);
	}
}
function cookieclicker(action) {
	if(action=="bake") {
		items[19].owned++;
		checkthings();
	}
	else if(action=="cursor") {
		if(items[19].owned>=Math.round(15*Math.pow(1.15,cursor))) {
			items[19].owned-=Math.round(15*Math.pow(1.15,cursor));
			cursor++;
			checkthings();
		}
	}
}
function vsinvisiblebot() {
	closemessage();
	powerhp();
	battle=makebattle(battleid,"Invisible Bot",750,750,"Invisible laser!",75,"An invisible robot!",9,power,hp,hp,currentsword,false,"vs-invisible-bot");
	html="<div class=\"alert alert-battle-invisible-bot\"><b>Invisible Bot</b><br>Here is the invisible bot, good luck!<br><br>"+battle.html+"</div>";
	$("#otheralerts").append(html);
	battle.init();
	$(".alert-battle-invisible-bot:last").fadeIn("fast");
}
function entermagicportal() {
	secondrealm = true;
	$(".fader").fadeIn("fast");
	setTimeout(function() {
		$(".fader").fadeOut("fast");
		$(".banner-plane").removeClass("world1")
		$("#wrapper").hide();
		$("#realworld").show();
		closemessage();
	}, 200);
}
function exitmagicportal() {
	secondrealm = false;
	$(".fader").fadeIn("fast");
	setTimeout(function() {
		$(".fader").fadeOut("fast");
		$(".banner-plane").addClass("world1")
		$("#wrapper").show();
		$("#realworld").hide();
		closemessage();
	}, 200);
}
function travel()
{
	if(secondrealm){
		exitmagicportal();
	}
	else{
		entermagicportal();
	}
}
function computeraction(type) {
	if(type=="disc") {
		if(items[23].owned>0) {
			items[23].owned--;
			$(".ylvis-the-fox").html("<iframe src=\"http://www.youtube.com/embed/jofNR_WkoCE?autoplay=1&controls=0&modestbranding=1&loop=1&rel=0&showinfo=0\" frameborder=\"0\" class=\"ylvis\" allowfullscreen></iframe>");
			$(".ylvis-the-fox").show();
		}
		else {
			alert('You have no disc to insert!');
		}
	}
	else if(type=="glasses") {
		items[24].owned++;
		makealert("get-glasses","Glasses!","You found some magical glasses!<br>These glasses allow you to see some mysterious things in the sand and travel quickly between realms.<br><br>You're amazing!",true);
	}
	else if(type=="error") {
computer="                                            _________________\n\
                                           |                 |\n\
                                           |   ___________   |\n\
                                           |  |   .....   |  |\n\
 ______________________________________    |  |___________|  |\n\
|  __________________________________  |   |   ___________   |\n\
| |<span class=\"bsod\">A problem has been detected and   </span>| |   |  |   .....   |  |\n\
| |<span class=\"bsod\">Windows has been shut down to     </span>| |   |  |___________|  |\n\
| |<span class=\"bsod\">prevent damage to your computer.  </span>| |   |   __   __   _   |\n\
| |<span class=\"bsod\">                                  </span>| |   |  |__| |__| |_|  |\n\
| |<span class=\"bsod\">The problem seems to be caused by </span>| |   |                 |\n\
| |<span class=\"bsod\">the following file: vmilib.sys    </span>| |   |                 |\n\
| |<span class=\"bsod\">                                  </span>| |   |                 |\n\
| |<span class=\"bsod\">SESSION2_INITIALIZATION_FAILED    </span>| |   |                 |\n\
| |<span class=\"bsod\">                                  </span>| |   |       .|.       |\n\
| |<span class=\"bsod\">If this is the first time you've  </span>| |   |      (   )      |\n\
| |<span class=\"bsod\">seen this Stop error screen.      </span>| |   |       '-'       |\n\
| |<span class=\"bsod\" style\"color:black;\">__________________________________</span>| |   |                 |\n\
|______________________________________|   |                 |\n\
                 |    |      '.            |                 |\n\
                 |    |        '-.-'-.-'-.-|                 |\n\
                 )    (                    |                 |\n\
                /      \\                   |                 |\n\
               /________\\                  |_________________|";
		$(".computer-ascii").html(computer);
		$(".ylvis-the-fox").hide();
	}
	else if(type=="goldfactory") {
		if(!buyfactory) {
			closemessage();
			makealert("buy-factory","The Gold Factory","Status: You work here, and you get 1 gold bar per second as your salary.<br><br><input type=\"button\" value=\"Make the boss happier\" onclick=\"makebosshappy()\" class=\"mediumbutton\">and receive a bonus!<br><input type=\"button\" value=\"Buy this factory\" onclick=\"buythefactory()\" class=\"buy-factory-button mediumbutton\">for 2,500 gold bars and get more bars per second!",true);
			checkitem();
		}
		else {
			closemessage();
			makealert("buy-factory-new","The Gold Factory","Status: You are the boss! :o<br><br>You currently have <span class=\"gold-mining\">"+goldmining+"</span> mining machines.<br>Production: <span class=\"gbps\">"+gbps+"</span> gold bars / second<br><br><input type=\"button\" value=\"Buy 1 mining machine\" onclick=\"buyminingmachinegold(1)\" class=\"buy-1-mining-gold bigbutton\"> (<span class=\"1-gold-cost\">"+goldprice+"</span> Iron Bars)<br><input type=\"button\" value=\"Buy 10 mining machines\" onclick=\"buyminingmachinegold(10)\" class=\"buy-10-mining-gold bigbutton\"> (<span class=\"10-gold-cost\">"+calculateTotalPrice(goldmining, 10, golddivisor)+"</span> Iron Bars)<br><input type=\"button\" value=\"Buy 100 mining machines\" onclick=\"buyminingmachinegold(100)\" class=\"buy-100-mining-gold bigbutton\"> (<span class=\"100-gold-cost\">"+calculateTotalPrice(goldmining, 100, golddivisor)+"</span> Iron Bars)<br><br>Don't worry, the total's the same no matter how many you buy at once!<br>You can also <input type='button' value='kill rats' onclick='killrats()'>or <input type='button' value='decipher codes' onclick='ciphercode()'>.",true);
			checkitem();
		}
		$(".ylvis-the-fox").hide();
	}
	else if(type=="power") {
		if(items[24].owned==0) {
computer="                                            _________________\n\
                                           |                 |\n\
                                           |   <span class=\"click\" onclick=\"computeraction('disc')\">___________</span>   |\n\
                                           |  <span class=\"click\" onclick=\"computeraction('disc')\">|   .....   |</span>  |\n\
 ______________________________________    |  <span class=\"click\" onclick=\"computeraction('disc')\">|___________|</span>  |\n\
|  __________________________________  |   |   ___________   |\n\
| |----------------------------------| |   |  |   .....   |  |\n\
| |http://voxelbugged.github.io/th...| |   |  |___________|  |\n\
| |----------------------------------| |   |   <span class=\"click\" onclick=\"computeraction('error')\">__</span>   __   _   |\n\
| |       <span class=\"click\" onclick=\"computeraction('goldfactory')\">...</span>                |       | |   |  <span class=\"click\" onclick=\"computeraction('error')\">|__|</span> |__| |_|  |\n\
| |     <span class=\"click\" onclick=\"computeraction('goldfactory')\">...</span>                  |       | |   |                 |\n\
| |   <span class=\"click\" onclick=\"computeraction('goldfactory')\">..</span>                     |_______| |   |                 |\n\
| |   <span class=\"click\" onclick=\"computeraction('goldfactory')\">||</span> <span class=\"click\" onclick=\"computeraction('goldfactory')\"> __</span>                         | |   |                 |\n\
| |   <span class=\"click\" onclick=\"computeraction('goldfactory')\">||</span> <span class=\"click\" onclick=\"computeraction('goldfactory')\">| #|__.</span>                     | |   |                 |\n\
| |__<span class=\"click\" onclick=\"computeraction('goldfactory')\">/__\\|__|__|</span>____________<span class=\"click\" onclick=\"computeraction('glasses')\">∞</span>________| |   |       <span class=\"click\" onclick=\"computeraction('power')\">.|.</span>       |\n\
| |                                  | |   |      <span class=\"click\" onclick=\"computeraction('power')\">(   )</span>      |\n\
| |________                  ________| |   |       <span class=\"click\" onclick=\"computeraction('power')\">'-'</span>       |\n\
| |________| _______________|________| |   |                 |\n\
|______________________________________|   |                 |\n\
                 |    |      '.            |                 |\n\
                 |    |        '-.-'-.-'-.-|                 |\n\
                 )    (                    |                 |\n\
                /      \\                   |                 |\n\
               /________\\                  |_________________|";
		}
		else {
computer="                                            _________________\n\
                                           |                 |\n\
                                           |   <span class=\"click\" onclick=\"computeraction('disc')\">___________</span>   |\n\
                                           |  <span class=\"click\" onclick=\"computeraction('disc')\">|   .....   |</span>  |\n\
 ______________________________________    |  <span class=\"click\" onclick=\"computeraction('disc')\">|___________|</span>  |\n\
|  __________________________________  |   |   ___________   |\n\
| |----------------------------------| |   |  |   .....   |  |\n\
| |http://voxelbugged.github.io/th...| |   |  |___________|  |\n\
| |----------------------------------| |   |   <span class=\"click\" onclick=\"computeraction('error')\">__</span>   __   _   |\n\
| |       <span class=\"click\" onclick=\"computeraction('goldfactory')\">...</span>                |       | |   |  <span class=\"click\" onclick=\"computeraction('error')\">|__|</span> |__| |_|  |\n\
| |     <span class=\"click\" onclick=\"computeraction('goldfactory')\">...</span>                  |       | |   |                 |\n\
| |   <span class=\"click\" onclick=\"computeraction('goldfactory')\">..</span>                     |_______| |   |                 |\n\
| |   <span class=\"click\" onclick=\"computeraction('goldfactory')\">||</span> <span class=\"click\" onclick=\"computeraction('goldfactory')\"> __</span>                         | |   |                 |\n\
| |   <span class=\"click\" onclick=\"computeraction('goldfactory')\">||</span> <span class=\"click\" onclick=\"computeraction('goldfactory')\">| #|__.</span>                     | |   |                 |\n\
| |__<span class=\"click\" onclick=\"computeraction('goldfactory')\">/__\\|__|__|</span>_____________________| |   |       <span class=\"click\" onclick=\"computeraction('power')\">.|.</span>       |\n\
| |                                  | |   |      <span class=\"click\" onclick=\"computeraction('power')\">(   )</span>      |\n\
| |________                  ________| |   |       <span class=\"click\" onclick=\"computeraction('power')\">'-'</span>       |\n\
| |________|________________|________| |   |                 |\n\
|______________________________________|   |                 |\n\
                 |    |      '.            |                 |\n\
                 |    |        '-.-'-.-'-.-|                 |\n\
                 )    (                    |                 |\n\
                /      \\                   |                 |\n\
               /________\\                  |_________________|";
		}
		$(".computer-ascii").html(computer);
		$(".ylvis-the-fox").hide();
	}
}

function searchsand() {
	random=randomnumber(10,31);
	if(random==10 || random == 11) {
		r=randomnumber(100,1000);
		goldbar+=r;
		$(".search-result").html("You got "+r+" gold bars!");
		searchtimes++;
	}
	else if(random==15 || random == 16) {
		r=randomnumber(100,1000);
		ironbar+=r;
		$(".search-result").html("You got "+r+" iron bars!");
		searchtimes++;
	}
	else if(random==20 || random == 21) {
		r=randomnumber(2,5);
		items[7].owned+=r;
		$(".search-result").html("You got "+r+" health potions!");
		searchtimes++;
	}
	else if (random==17) {
		closemessage();
		powerhp();
		battle=makebattle(battleid,"Sand Shark",750,750,"Fins & teeth",100,"How it swims, no one knows.",12,power,hp,hp,currentsword,false,"vs-shark");
		html="<div class=\"alert alert-shark-fight\"><b>Surprise!</b><br>You have found a wild sand shark! It won't let you flee!<br><br>"+battle.html+"</div>";
		$("#otheralerts").append(html);
		battle.init();
		$(".alert-shark-fight:last").fadeIn("fast");
		searchtimes++;
		$(".flee-button").attr("disabled",true);
	}
	else {
		$(".search-result").html("You got nothing :(");
	}
}
function burysand() {
	if(gethole) {
		closemessage();
		makealert("suffocated","Suffocated","You have suffocated inside the sand :(<br>GAME OVER!<br>Just kidding...",true);
	}
	else {
		closemessage();
		makealert("bury-sand","...","You start to bury yourself inside the sand, when you suddenly fall into a hole!",true);
		gethole=true;
	}
}
function guy(step) {
	if(step==1) {
story="\n\
       _\n\
   .&bull;'   '&bull;.    \"It seems that I have seen            O\n\
  /         \\    that guy before, hmmmm...\"          /|\\\n\
 |           |                                        |\n\
 |           |                                       / \\\n\
  \\         /    <input type='button' value='Next >' onclick='guy(2)'>                              \n\
   '&bull;.   .&bull;'\n\
     /   \\\n\
    / | | \\\n\
   / /| |\\ \\\n\
  / / | | \\ \\\n\
";
		$(".boss-story").html(story);
	}
	else if(step==2) {
story="\n\
       _\n\
   .&bull;'   '&bull;.    \"Oh, yes, I know him!                 O\n\
  /         \\    He is the one who brought me        /|\\\n\
 |           |   to this weird world >:C\"             |\n\
 |           |                                       / \\\n\
  \\         /    <input type='button' value='Next >' onclick='guy(3)'>                              \n\
   '&bull;.   .&bull;'\n\
     /   \\\n\
    / | | \\\n\
   / /| |\\ \\\n\
  / / | | \\ \\\n\
";
		$(".boss-story").html(story);
	}
	else if(step==3) {
story="\n\
       _\n\
   .&bull;'   '&bull;.    \"I must kill him!\"                    O\n\
  /         \\                                        /|\\\n\
 |           |                                        |\n\
 |           |                                       / \\\n\
  \\         /    <input type='button' value='Next >' onclick='guy(4)'>                              \n\
   '&bull;.   .&bull;'\n\
     /   \\\n\
    / | | \\\n\
   / /| |\\ \\\n\
  / / | | \\ \\\n\
";
		$(".boss-story").html(story);
	}
	else if(step==4) {
story="\n\
       _\n\
   .&bull;'   '&bull;.                    \"No, you can't kill   O\n\
  /         \\                   me, you idiot >:(\"   /|\\\n\
 |           |                                        |\n\
 |           |                                       / \\\n\
  \\         /    <input type='button' value='Fight!' onclick='guy(5)'>                              \n\
   '&bull;.   .&bull;'\n\
     /   \\\n\
    / | | \\\n\
   / /| |\\ \\\n\
  / / | | \\ \\\n\
\n\
\n\
PS: He heals 5 HP each time he attacks you, and he also has armor!";
		$(".boss-story").html(story);
	}
	else if(step==5) {
		closemessage();
		powerhp();
		battle=makebattle(battleid,"Mr. Professor",2500,2500,"Super powerful sword",100,"He brought you into this weird world!",0,power,hp,hp,currentsword,false,"vs-boss");
		html="<div class=\"alert alert-boss-fight\"><b>Fight! Fight! Fight!</b><br>This dude has brought you to this weird world without your permission, and now you've found him!<br><br>"+battle.html+"</div>";
		$("#otheralerts").append(html);
		battle.init();
		$(".alert-boss-fight:last").fadeIn("fast");
	}
}
function openthechestfromsomeone() {
	if(cheststep==0) {
		closemessage();
		makealert("chest-locked","Locked","The chest is locked, you need a key to open it!<br><br><input type='button' onclick='openthechest()' class='mediumbutton' value='Open the chest'>",true);
	}
	else if(cheststep==1) {
		closemessage();
		makealert("chest-locked2","Password?","Oh no! You need a password to open the chest. This chest is really annoying...<br><br>Please type the password<br><input type='text' id='chest-password-form'><br><br><input type='button' class='mediumbutton' value='Submit' onclick='openthechest()'>",true);
	}
	else if(cheststep==2) {
		closemessage();
message='\n\
   _______________________\n\
 =(__    ___      __     _)=\n\
   |                     |\n\
   | A message from the  |\n\
   | original dev to you:|\n\
   |                     |\n\
   | Hi! and thanks for  |\n\
   | playing my game! :D |\n\
   |                     |\n\
   | I would like to say |\n\
   | Congratulations!!!! |\n\
   | You won the game!   |\n\
   |                     |\n\
   | But maybe this game |\n\
   | is not finished for |\n\
   | you, have you dug   |\n\
   | through the end?    |\n\
   |                     |\n\
   | If not, then do it! |\n\
   |                     |\n\
   | If yes, then I      |\n\
   | think you will be   |\n\
   | bored, that\'s why   |\n\
   | I recommend you to  |\n\
   | <a href="http://bit.ly/1gMQO9u">Click here</a> to kill  |\n\
   | your boredom :D     |\n\
   |                     |\n\
   | -gamehelp16         |\n\
 =(_______________________)=\n\
';
		makealert("open-chest","A message","<div style='max-height:300px; overflow-y:auto;'>Hey, what's this? The chest contains a message!<br><pre>"+message+"</pre></div>",true);
	}
}

// Just some random comment ;)

function openthechest() {
	if(cheststep==0) {
		if(items[21].owned==1) {
			items[21].owned--;
			cheststep++;
			alert('The chest has been opened!');
			closemessage();
		}
		else {
			alert('You need a key to open the chest!');
		}
	}
	else if(cheststep==1) {
		if($("#chest-password-form").val()=="password" || $("#chest-password-form").val()=="the password") {
			alert('Sorry, this is not a trick question! Or another cipher, if you were wondering.');
		}
		else if($("#chest-password-form").val()=="Ring-ding-ding-ding-dingeringeding!") {
			cheststep++;
			alert('Correct password! Access granted!');
			closemessage();
		}
		else {
			alert('Wrong password!');
		}
	}
}

function endlessgate() {
	closemessage();
	powerhp();
	multiplier = 1.1**endlesswave;
	ratio = (0.5 - Math.random())/5;
	battle=makebattle(battleid,"Placeholder McGuy",Math.round(2000 * multiplier * (1+ratio)),Math.round(2000 * multiplier * (1+ratio)),"Placeholder Sword",Math.round(100 * multiplier * (1-ratio)),"Just here for the beta. Moves fast and breaks things.",0,power,hp,hp,currentsword,false,"vs-endless-gate");
	html="<div class=\"alert alert-vs-endless-gate\"><b>Wave "+(endlesswave+1).toLocaleString("en")+" - for glory!</b><br>Don't hold anything back!<br>"+battle.html+"</div>";
	$("#otheralerts").append(html);
	battle.init();
	$(".alert-vs-endless-gate:last").fadeIn("fast");
}
function localstoragehelp() {
	alert('It\'s a feature that allows the game to save progress in your browser. Technology!');
}

function save() {
	makealert("save","Save Options","Here, you can save your progress, or change options relating to doing that.<br><br><input type='button' value='Save game' class='mediumbutton' onclick='dosave(\"autolocalstorage\")'> (Uses HTML5 Local Storage <small>[<a href='javascript:localstoragehelp();' title='What is HTML5 Local Storage?'>?</a>]</small>)<br><input type='button' class='mediumbutton' value='Save game as text' onclick='dosave(\"text\")'><br><input type='button' value='Load game' class='mediumbutton' onclick='dosave(\"load\")'><br><input type='button' value='Reset game' class='mediumbutton' onclick='dosave(\"reset\")'><br><input type='button' value='Toggle autosave' class='mediumbutton' onclick='dosave(\"autotoggle\")'> Game autosaves in <span id='autosavetime'>"+autosavetime+"</span> second(s)",true);
}

function dosave(param) {
	if(param=='autotoggle') {
		if(autosave) {
			autosave=false;
			alert('Autosave disabled!');
		}
		else {
			autosave=true;
			alert('Autosave enabled!');
		}
	}
	else if(param=='text') {
		prompt("Save the code somewhere safe!", savegame());
	}
	else if(param=='load') {
		savecode=prompt("Please enter the save code", "Enter the code here");
		if(savecode.slice(-9)=="encrypted")savecode=atob(savecode.replace("encrypted",""));
		savecode=savecode.split("|");

		if(savecode.length<75) {
			alert('Invalid save code!');
			return;
		}
		loadgame(savecode);
		checkthings();
		dosave("autolocalstorage");
		location.reload();
	}
	else if(param=='loadlocalstorage') {
		savecode=localStorage.thegoldfactorygamesave;
		if(savecode.slice(-9)=="encrypted")savecode=atob(savecode.replace("encrypted",""));
		savecode=savecode.split("|");
		loadgame(savecode);
		checkthings();

	}
	else if(param=="autolocalstorage") {

		if(typeof(Storage) === "undefined") {
			alert('Update your browser, dammit, it\'s 2024 and you still don\'t have local storage! How?');
		}

		localStorage.thegoldfactorygamesave=savegame();

		if(changecredits) {
			justarandomvariablename=$('#credits').html();
			$('#credits').html("(Game saved!)&nbsp;"+justarandomvariablename);
			changecredits = false;
			setTimeout(function() {
				$('#credits').html(justarandomvariablename);
				changecredits = true;
			},5000);
		}
	}
	else if(param=="reset") {
		a=confirm("Are you sure you want to reset your game?");
		if(a) {
			b=confirm("Last warning - are you REALLY sure? Remember, this can't be undone!");
			if(b) {
				localStorage.clear();
				location.reload();
			}
		}
	}
}
function loadgame(savecode) {
	goldbar=parseInt(savecode[0]);
		ironbar=parseInt(savecode[1]);
		gbps=parseInt(savecode[2]);
		goldmining=parseInt(savecode[3]);
		ibpt=parseInt(savecode[4]);
		ibtime=parseInt(savecode[5]);
		ironmining=parseInt(savecode[6]);
		items[0].owned=parseInt(savecode[7]);
		items[1].owned=parseInt(savecode[8]);
		items[2].owned=parseInt(savecode[9]);
		items[3].owned=parseInt(savecode[10]);
		items[4].owned=parseInt(savecode[11]);
		items[5].owned=parseInt(savecode[12]);
		items[6].owned=parseInt(savecode[13]);
		items[7].owned=parseInt(savecode[14]);
		items[8].owned=parseInt(savecode[15]);
		items[9].owned=parseInt(savecode[16]);
		items[10].owned=parseInt(savecode[17]);
		items[11].owned=parseInt(savecode[18]);
		items[12].owned=parseInt(savecode[19]);
		items[13].owned=parseInt(savecode[20]);
		items[14].owned=parseInt(savecode[21]);
		items[15].owned=parseInt(savecode[22]);
		items[16].owned=parseInt(savecode[23]);
		items[17].owned=parseInt(savecode[24]);
		items[18].owned=parseInt(savecode[25]);
		items[19].owned=parseInt(savecode[26]);
		items[20].owned=parseInt(savecode[27]);
		items[21].owned=parseInt(savecode[28]);
		items[22].owned=parseInt(savecode[29]);
		items[23].owned=parseInt(savecode[30]);
		items[24].owned=parseInt(savecode[31]);
		items[25].owned=parseInt(savecode[83]);
		items[26].owned=parseInt(savecode[84]);
		enchant_attack=parseInt(savecode[32]);
		enchant_defense=parseInt(savecode[33]);
		enchant_countdown=parseInt(savecode[34]);
		enchant_life=parseInt(savecode[35]);
		helmet=parseFloat(savecode[36]);
		chestplate=parseFloat(savecode[37]);
		pants=parseFloat(savecode[38]);
		boots=parseFloat(savecode[39]);
		theusername=savecode[40];
		theuserdesc=savecode[41];
		cheststep=parseInt(savecode[42]);
		searchtimes=parseInt(savecode[43]);
		shovelbroken=parseInt(savecode[44]);
		cursor=parseInt(savecode[45]);
		pizzaeaten=(savecode[46] === "true");
		poisoned=(savecode[47] === "true");
		chestunderground=(savecode[48] === "true");
		talk=parseInt(savecode[49]);
		wob=(savecode[50] === "true");
		buyfactory=(savecode[51] === "true");
		skill=savecode[52];
		skilllvl=parseInt(savecode[53]);
		additionalattack=parseInt(savecode[54]);
		clickcloudcount=parseInt(savecode[55]);
		openchestcount=parseInt(savecode[56]);
		candybox=(savecode[57] === "true");
		hpactive=parseInt(savecode[58]);
		airplanecountdown=parseInt(savecode[59]);
		digcountdown=parseInt(savecode[60]);
		digstep=parseInt(savecode[61]);
		currentsword=savecode[62];
		passthief=(savecode[63] === "true");
		passworms=(savecode[64] === "true");
		passgate=(savecode[65] === "true");
		unlockenchant=(savecode[66] === "true");
		unlockchest=(savecode[67] === "true");
		beatboss=(savecode[68] === "true");
		hasairplane=(savecode[69] === "true");
		reachedclouds=(savecode[70] === "true");
		defeatinvisiblebot=(savecode[71] === "true");
		gethole=(savecode[72] === "true");
		win=(savecode[73] === "true");
		hasportal=(savecode[74] === "true");
		if(savecode.length>=76) { cipherstep=parseInt(savecode[75]); } else { cipherstep=0; }
		if(savecode.length>=77) { activatemachine=(savecode[76] === "true"); } else { activatemachine=0; }
		if(savecode.length>=78) { autosave=(savecode[77] === "true"); } else { autosave=false; }
		if(savecode.length>=79) { autoattack=(savecode[78] === "true"); } else { autoattack=false; }
		if(savecode.length>=80) { pizzacollected=(savecode[79] === "true"); } else { pizzacollected = false; }
		if(savecode.length>=81) { weapontype=savecode[80]; } else { weapontype = "Sword"; }
		if(savecode.length>=82) { endlesswave=parseInt(savecode[81]); } else { endlesswave = 0; }
		if(savecode.length>=83) { ovenlevel=parseInt(savecode[82]); } else { ovenlevel = 0; }
		if(savecode.length>=86) { offhand=savecode[85]; } else { offhand = "none"; }
		if(savecode.length>=87) { shieldlevel=parseInt(savecode[86]); } else { shieldlevel = 0; }
		if(pizzaeaten && ovenlevel == 0) {
			ovenlevel = 1;
		}
}
function savegame(){
	return btoa(goldbar+"|"+ironbar+"|"+gbps+"|"+goldmining+"|"+ibpt+"|"+ibtime+"|"+ironmining+"|"+items[0].owned+"|"+items[1].owned+"|"+items[2].owned+"|"+items[3].owned+"|"+items[4].owned+"|"+items[5].owned+"|"+items[6].owned+"|"+items[7].owned+"|"+items[8].owned+"|"+items[9].owned+"|"+items[10].owned+"|"+items[11].owned+"|"+items[12].owned+"|"+items[13].owned+"|"+items[14].owned+"|"+items[15].owned+"|"+items[16].owned+"|"+items[17].owned+"|"+items[18].owned+"|"+items[19].owned+"|"+items[20].owned+"|"+items[21].owned+"|"+items[22].owned+"|"+items[23].owned+"|"+items[24].owned+"|"+enchant_attack+"|"+enchant_defense+"|"+enchant_countdown+"|"+enchant_life+"|"+helmet+"|"+chestplate+"|"+pants+"|"+boots+"|"+theusername+"|"+theuserdesc+"|"+cheststep+"|"+searchtimes+"|"+shovelbroken+"|"+cursor+"|"+pizzaeaten+"|"+poisoned+"|"+chestunderground+"|"+talk+"|"+wob+"|"+buyfactory+"|"+skill+"|"+skilllvl+"|"+additionalattack+"|"+clickcloudcount+"|"+openchestcount+"|"+candybox+"|"+hpactive+"|"+airplanecountdown+"|"+digcountdown+"|"+digstep+"|"+currentsword+"|"+passthief+"|"+passworms+"|"+passgate+"|"+unlockenchant+"|"+unlockchest+"|"+beatboss+"|"+hasairplane+"|"+reachedclouds+"|"+defeatinvisiblebot+"|"+gethole+"|"+win+"|"+hasportal+"|"+cipherstep+"|"+activatemachine+"|"+autosave+"|"+autoattack+"|"+pizzacollected+"|"+weapontype+"|"+endlesswave+"|"+ovenlevel+"|"+items[25].owned+"|"+items[26].owned+"|"+offhand+"|"+shieldlevel)+"encrypted";
}

jQuery.fn.shake = function() {
    this.each(function(i) {
        for (var x = 1; x <= 2; x++) {
            $(this).animate({ marginLeft: 25 }, 10).animate({ marginLeft: -25 }, 50).animate({ marginLeft: 25 }, 10).animate({ marginLeft: 0 }, 50);
        }
    });
    return this;
}



/* BATTLE SYSTEM */

function makebattle(id,name,hp,maxhp,weapon,damage,description,enemyascii,power,myhp,mymaxhp,myweapon,loop,param) {
	berserked = false;
	enemyasciis=[];
enemyasciis.push("\n\
     O\n\
    /|\\\n\
     |\n\
    / \\");
enemyasciis.push("\n\
\n\
    ~    ~\n\
  ~   ~     ~\n\
    ~    ~");
enemyasciis.push("\n\
    [_]\n\
    /|\\\n\
     |\n\
    / \\");
enemyasciis.push("\n\
     (_(\n\
    ('')\n\
  _  \"\\ )>,_     .-->\n\
  _>--w/((_ >,_.'\n\
         ///\n\
         \"`\"");
enemyasciis.push("\n\
    ___\n\
   /.. \\_\n\
 __\\0  / )\n\
(__/    /\n\
  /     \\\n\
 /_      \\\n\
   ``\"\"\"\"\"`");
enemyasciis.push("\n\
        _ (m)\n\
  __(\")/ |\n\
 ( (   )/\n\
 / |   | \n\
 \\( ( ) )\n\
  /_| |_\\");
enemyasciis.push("\n\
\\\n\
 \\ji\n\
 /.((( \n\
(,/\"(((__,--.\n\
    \\  ) _( /{ \n\
    !|| \" :||\n\
    !||   :||\n\
    '''   ''' ");
enemyasciis.push("\n\
  _W_\n\
_ (\")\n\
 \\/ /\\_\n\
  \\ \\\n\
__///__");
enemyasciis.push('\n\
     ,\n\
    {\\\\\n\
   {~ \\\\\n\
   {~=_\\\\,;._\n\
    {~-(;; \'_)\n\
   ,~---"  /\n\
~~~( )__\\ )\n\
   /))  \\\\\\\n\
   \\\\\\   \\\\\\\n\
    ``"   `"\'');
enemyasciis.push("\n\
\n\
\n\
\n\
");
enemyasciis.push("\n\
            ,^\n\
           ;  ;\n\
\\`.,'/      ; ;\n\
/_  _\\`-----';\n\
  \\/` ,,,,,, ;\n\
    )//     \\))");
enemyasciis.push("\n\
	   _  _\n\
  (o)(o)--.\n\
   \\../ (  )\n\
   m\\/m--m'`--.");
enemyasciis.push("\n\
        /|       ./\n\
_--~~  ~~---___.'/\n\
~-_o_)  ___----~~\\\n\
     `\\|");
output2="<tr><td>";
output2=output2+"<pre style=\"opacity:0;\">\n\
     O\n\
    /|\\\n\
     |\n\
    / \\</pre>";

output2=output2+"<pre style=\"position:absolute;margin-top:-77px;\" class=\"player-"+id+"\">\n\
     O\n\
    /|\\\n\
     |\n\
    / \\</pre>";


if(currentsword=="Wooden Sword") { stype="Wood"; }
if(currentsword=="Stone Sword") { stype="Stone"; }
if(currentsword=="Iron Sword") { stype="Iron"; }
if(currentsword=="Diamond Sword") { stype="Diamond"; }
if(currentsword=="Emerald Sword") { stype="Diamond"; }

//output2=output2+"<img style=\"position:absolute;\" class=\"player-sword-"+id+"\" src=\"images/sword"+stype+".png\">";

output2=output2+"<pre style=\"position:absolute;margin-top:-180px;margin-left:50px;opacity:0;\" class=\"thunder-"+id+"\">\n\
                         ___\n\
                        /  /  \n\
     ..zzzZAP!!!!!     /  /  \n\
                     _/ ./  \n\
                    / ./   \n\
                   / /  \n\
              .   /./    \n\
         ..   |  //  .    \n\
      .   \\\\  | /' .'  .  \n\
       ~-. `     ' .-~  \n\
           _.oOOo._       </pre>";

output2=output2+"</td><td style=\"width:50px;\"></td><td>";
output2=output2+"<pre style=\"opacity:0;\">"+enemyasciis[enemyascii]+"</pre>";

if(enemyascii==3) {
	output2=output2+"<pre style=\"position:absolute;margin-top:-120px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}
else if(enemyascii==4) {
	output2=output2+"<pre style=\"position:absolute;margin-top:-140px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}
else if(enemyascii==5) {
	output2=output2+"<pre style=\"position:absolute;margin-top:-125px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}
else if(enemyascii==6) {
	output2=output2+"<pre style=\"position:absolute;margin-top:-165px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}
else if(enemyascii==7) {
	output2=output2+"<pre style=\"position:absolute;margin-top:-103px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}
else if(enemyascii==8) {
	output2=output2+"<pre style=\"position:absolute;margin-top:-210px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}
else if(enemyascii==10) {
	output2=output2+"<pre style=\"position:absolute;margin-top:-125px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}
else {
	output2=output2+"<pre style=\"position:absolute;margin-top:-77px;\" class=\"enemy-"+id+"\">"+enemyasciis[enemyascii]+"</pre>";
}

if(name=="Thief") {
	//output2=output2+"<img style=\"position:absolute;\" class=\"enemy-sword-"+id+"\" src=\"images/swordWood.png\">";
}
else if(name=="Castle Guard") {
	//output2=output2+"<img style=\"position:absolute;\" class=\"enemy-sword-"+id+"\" src=\"images/swordGold.png\">";
}
else if(name=="Castle Staff") {
	//output2=output2+"<img style=\"position:absolute;\" class=\"enemy-sword-"+id+"\" src=\"images/swordIron.png\">";
}
else if(name=="Zombie King") {
	//output2=output2+"<img style=\"position:absolute;\" class=\"enemy-sword-"+id+"\" src=\"images/swordDiamond.png\">";
}


output2=output2+"</td></tr><tr><td>";
output2=output2+"<span class=\"you-"+id+"\"><b>"+theusername+"</b></span> (<span class=\"player-"+id+"-hp\">"+myhp.toLocaleString("en")+"</span>/"+mymaxhp.toLocaleString("en")+")<br>Damage: "+power.toLocaleString("en")+"<br>Weapon: "+currentsword.substring(0, currentsword.indexOf('Sword')) + weapontype+"<br>\"<span class=\"you-desc-"+id+"\">"+theuserdesc+"</span>\"";
output2=output2+"</td><td><div style=\"text-align:center;\">VS</div></td><td>";
output2=output2+"<b>"+name+"</b> (<span class=\"enemy-"+id+"-hp\">"+hp.toLocaleString("en")+"</span>/"+maxhp.toLocaleString("en")+")<br>Damage: "+damage.toLocaleString("en")+"<br>Weapon: "+weapon+"<br>\""+description+"\"";
output2=output2+"</td></tr>";

output="<table id=\"battle-"+id+"\">"+output2+"</table><br><div class=\"buttons-"+id+"\"><input type=\"button\" value=\"Attack!\" class=\"button-attack-"+id+" smallbutton\" onclick=\"attackenemy("+id+","+power+","+hp+",'"+param+"',"+mymaxhp+")\">\n\
<input type=\"button\" value=\"["+items[7].owned.toLocaleString("en")+"] Health Potion\" style=\"display:none;\" class=\"button-health-"+id+" mediumbutton\" onclick=\"drinkhealthpotion("+id+","+mymaxhp+")\">\n\
<input type=\"button\" value=\"Use skill\" style=\"display:none;\" class=\"button-skill-"+id+" mediumbutton\" onclick=\"usetheskill("+id+")\"><hr>\n\
<input type=\"button\" value=\"["+items[12].owned.toLocaleString("en")+"] Poison\" class=\"button-potion-12-"+id+" smallbutton\" onclick=\"usepotion(12,"+id+")\">\n\
<input type=\"button\" value=\"["+items[13].owned.toLocaleString("en")+"] Confusion\" class=\"button-potion-13-"+id+" smallbutton\" onclick=\"usepotion(13,"+id+")\">\n\
<input type=\"button\" value=\"["+items[14].owned.toLocaleString("en")+"] Invisibility\" class=\"button-potion-14-"+id+" smallbutton\" onclick=\"usepotion(14,"+id+")\">\n\
<input type=\"button\" value=\"["+items[15].owned.toLocaleString("en")+"] Countdown\" class=\"button-potion-15-"+id+" smallbutton\" onclick=\"usepotion(15,"+id+")\">\n\
<input type=\"button\" value=\"["+items[16].owned.toLocaleString("en")+"] Gambler's\" class=\"button-potion-16-"+id+" smallbutton\" onclick=\"usepotion(16,"+id+")\">\n\
<input type=\"button\" value=\"["+items[17].owned.toLocaleString("en")+"] Cookie\" class=\"button-potion-17-"+id+" smallbutton\" onclick=\"usepotion(17,"+id+")\">\n\
<input type=\"button\" value=\"["+items[18].owned.toLocaleString("en")+"] X\" class=\"button-potion-18-"+id+" smallbutton\" onclick=\"usepotion(18,"+id+")\">\n\
<input type=\"button\" value=\"["+items[26].owned.toLocaleString("en")+"] Berserk\" class=\"button-potion-26-"+id+" smallbutton\" onclick=\"usepotion(26,"+id+")\"> <span class=\"potion-countdown-"+id+"\"></span></div>\n\
<hr class=\"potion-separator-"+id+"\"><input type=\"button\" value=\"Flee!\" class='smallbutton flee-button' onclick=\"closemessage(); battle_ended();\">\n\
<input type=\"button\" value=\"Toggle auto-attack\" class='mediumbutton flee-button' onclick=\"toggleautoattack("+id+");\">";
	if(hp<=0) {
		if(winningbattle == false)
			{
				winningbattle = true;
				setTimeout(function(){winbattle(param,id);},2000);
			}
	}
	else if(myhp<=0) {
		//lose
		setTimeout(function(){closemessage(); battle_ended();},2000);
	}
	else {
		instasused = 0;
		// this should have happened already, but just in case
		stop_battle_timers();

		if(poisoned) {
			$(".player-"+id+"-hp").html(10);
			myhealthpoint(true,10);
		}
		else {
			myhealthpoint(true,myhp);
		}
		enemyhealthpoint(true,hp);
		enemyhealthpoint2(true,hp);
		enemy_attack_timer = setTimeout(function(){enemyattack(id,damage);},2000+Math.random()*1000);
		theparam(true,param);
		isinvuln(true,false);
		battlestop(true,false);
		enemyconfused(true,false);
		isinvisible(true,false);
		theenemyascii(true,enemyascii);
		theenemyname123(true,name);
		$(".modal").show();
		attackdelay(id,0);
		healthdelay(id,0);
		skilldelay(id,0);
		clearTimeout(potiontimeout);
	}

	var init_func = function() {
						checkhealthbutton(id);
						checkskillbutton(id);
						checkpotionsbutton(id);
				};

	if(!loop) {
		if(autoattack) {
			setTimeout(function(){attackdelay(id,1);$(".button-attack-"+id).attr("disabled",true);}, 0);
		}
		return { html: output,
			     init: init_func
				};
	}
	else {
		$("#battle-"+id).html(output2);
		init_func();
	}
}
function toggleautoattack(id)
{
	autoattack = !autoattack;
	if(autoattack) {
		alert("Auto-attack is now enabled!");
		if($(".button-attack-"+id).attr("disabled") == undefined) {
			$(".button-attack-"+id).click();
		}
	}
	else {
		alert("Auto-attack is now disabled.");
	}
}
function enemyattack(id,damage) {
	if(id=="clear") {
		//clearTiemout(asdasdf);
	}
	else {
		$(".button-health-"+id).attr("onclick","drinkhealthpotion("+id+","+myhealthpoint(false,0)+")");
		if(myhealthpoint(false,0)<=0) {
			setTimeout(function(){closemessage(); battle_ended();},0);
			//clearTiemout(asdasdf);
		}
		else {
			if(battlestop(false,0)==false) {
				enemyisattacking=true;
				if(!enemyconfused(false,0)) {
					$(".enemy-"+id).animate({"margin-left":-160+"px"},200);
					$(".enemy-sword-"+id).animate({"margin-left":-160+"px"},200);
				}
				enemy_attack_timer = setTimeout(function(){
					// actually perform the attack
					// this timer is set to coincide with the completion of the above animate() calls [200ms]
					lagipusing=false;
					if(isinvuln(false,0)==false) {
						if(enemyconfused(false,0)) {
							enemyhp=enemyhealthpoint(false,0);
							enemyhp-=damage;
							enemyhealthpoint(true,enemyhp);
							$(".enemy-"+id+"-hp").html(enemyhp.toLocaleString("en"));
							enemyconfused(true,false);
							lagipusing=true;

							if(enemyhealthpoint(false,0)<=0) {
								thenewhp=enemyhealthpoint(true,0);
								$(".enemy-"+id+"-hp").html("0");
								$(".button-attack-"+id).attr("disabled",true);
								if(winningbattle == false) {
									winningbattle = true;
									setTimeout(function(){winbattle(theparam(false,0),id);},0);
								}
								return;
							}

						}
						else {
							myhp=myhealthpoint(false,0);
							absorb=helmet+chestplate+pants+boots;
							if(offhand=="Shield"){
								absorb+=(shieldlevel*5)*((100-absorb)/100);
							}
							myhp-=damage-Math.round(damage*(absorb/100));
							myhealthpoint(true,myhp);
						}
					}
					if(myhealthpoint(false,0)<=0) {
						myhealthpoint(true,0)
						myhp=myhealthpoint(false,0);
						enemyattack(id,damage,myhp);
						if(!lagipusing) {
							$(".enemy-"+id).animate({"margin-left":0+"px"},200);
							$(".enemy-sword-"+id).animate({"margin-left":21+"px"},200);
						}
						$(".player-"+id+"-hp").html(myhp.toLocaleString("en"));
						$(".button-attack-"+id).attr("disabled",true);
					}
					else {
						myhp=myhealthpoint(false,0);
						$(".player-"+id+"-hp").html(myhp.toLocaleString("en"));
						if(!lagipusing) {
							$(".enemy-"+id).animate({"margin-left":0+"px"},200);
							$(".enemy-sword-"+id).animate({"margin-left":21+"px"},200);
						}
						enemyisattacking=false;
						if(theenemyname123(false,0)=="Mr. Professor") {
							hp=enemyhealthpoint(false,0);
							hp+=5;
							enemyhealthpoint(true,hp);
							$(".enemy-"+id+"-hp").html(hp.toLocaleString("en"));
						}
						// Schedule a new attack
						enemy_attack_timer = setTimeout(function(){enemyattack(id,damage);},1800+Math.random()*1000);
					}
				},200);
			}
		}
		$(".button-health-"+id).attr("onclick","drinkhealthpotion("+id+","+myhealthpoint(false,0)+")");
	}
}
function attackenemy(id,power,hp,param,mymaxhp) {
	mindelay = 3;
	if(theenemyascii(false,0)==9 && isinvisible(false,0)==false) {
		alert('You can\'t attack the bot because you can\'t see it!');
		return;
	}
	if(enemyhealthpoint(false,0)<=0) {
		enemyattack("clear",0);
		if(winningbattle == false) {
			winningbattle = true;
			setTimeout(function(){winbattle(param,id);},0);
		}
	}
	else {
		if(id>0) {
			myhp=myhealthpoint(false,0);
			myhp+=enchant_life*2;
			powerhp();
			if(myhp>mymaxhp) {
				myhp=mymaxhp;
			}
			myhealthpoint(true,myhp);
			$(".player-"+id+"-hp").html(myhp.toLocaleString("en"));
			playerisattacking=true;
			attackdelay(id,mindelay);
			$(".player-"+id).animate({"margin-left":160+"px"},200);
			$(".player-sword-"+id).animate({"margin-left":200+"px"},200);
			setTimeout(function(){
				hp=enemyhealthpoint(false,0);
				if(theenemyname123(false,0)=="Mr. Professor") {
					newpower = power - Math.round(power/5);
				}
				else {
					newpower = power;
				}
				if(berserked) {
					hp-= newpower*3;
					berserked = false;
					$(".alert").shake();
				}
				else {
					hp-= newpower;
				}
				if(offhand == "Dagger"){
					goldbar += Math.round(newpower/4);
				}
				enemyhealthpoint(true,hp);
				if(enemyhealthpoint(false,0)<=0) {
					thenewhp=enemyhealthpoint(true,0);
					attackenemy(id,power,hp,param,mymaxhp);
					$(".player-"+id).animate({"margin-left":0+"px"},200);
					$(".player-sword-"+id).animate({"margin-left":50+"px"},200);
					$(".enemy-"+id+"-hp").html("0");
					$(".button-attack-"+id).attr("disabled",true);
				}
				else {
					hp=enemyhealthpoint(false,0);
					$(".enemy-"+id+"-hp").html(hp.toLocaleString("en"));
					$(".player-"+id).animate({"margin-left":0+"px"},200);
					$(".player-sword-"+id).animate({"margin-left":50+"px"},200);
					$(".button-attack-"+id).attr("onclick","attackenemy("+id+","+power+","+hp+",'"+param+"',"+mymaxhp+")");
					playerisattacking=false;
				}
			},200);
		}
	}
}
function attackdelay(id,sec) {
	if(sec!=0) {
		$(".button-attack-"+id).attr("disabled",true);
		$(".button-attack-"+id).attr("value","Attack! ("+sec+")");
		sec--;
		timeoutdelay = 1000-(enchant_countdown*100);
		attacktimeout=setTimeout(function(){attackdelay(id,sec);},attackspeed);
	}
	else {
		$(".button-attack-"+id).removeAttr("disabled");
		$(".button-attack-"+id).attr("value","Attack!");
		if(autoattack && id == battleid){
			$(".button-attack-"+id).click();
		}
	}
}
function checkhealthbutton(id) {
	if(items[7].owned!=0) {
		$(".button-health-"+id).show();
	}
	else {
		$(".button-health-"+id).hide();
	}
}
function checkskillbutton(id) {
	if(skill!="none") {
		$(".button-skill-"+id).show();
	}
	else {
		$(".button-skill-"+id).hide();
	}
}
function checkpotionsbutton(id) {
	let showseparator = false;
	let validpotions = [12, 13, 14, 15, 16, 17, 18, 26];
	for(const i of validpotions) {
		thepotionname=items[i];
		if(thepotionname.owned>0) {
			$(".button-potion-"+i+"-"+id).show();
			showseparator = true;
		}
		else {
			$(".button-potion-"+i+"-"+id).hide();
		}
	}
	if(showseparator)
	{
		$(".potion-separator-"+id).show();
	}
	else
	{
		$(".potion-separator-"+id).hide();
	}
}
function drinkhealthpotion(id, mymaxhp) {
	if(items[7].owned!=0) {
		mindelay = 6;
		items[7].owned-=1;
		checkhealthbutton(id);
		checkthings();
		myhp=myhealthpoint(false,0);
		myhp+=50;
		powerhp();
		if(myhp>mymaxhp) {
			myhp=mymaxhp;
		}
		myhealthpoint(true,myhp);
		$(".player-"+id+"-hp").html(myhp.toLocaleString("en"));
		$(".button-health-"+id).attr("onclick","drinkhealthpotion("+id+","+myhp+")");
		healthdelay(id,mindelay);
	}
}
function usetheskill(id) {
	if(skill!="none") {
		mindelay = 20;
		if(skill=="thunder") {
			enemyhp=enemyhealthpoint(false,0);
			enemyhp-=20+skilllvl*10;
			enemyhealthpoint(true,enemyhp);
			if(enemyhealthpoint(false,0)<=0) {
				enemyhealthpoint(true,0);
			}
			$(".enemy-"+id+"-hp").html(enemyhp.toLocaleString("en"));
			$(".thunder-"+id).css("opacity","1");
			$(".alert").shake();
			setTimeout(function() {
				$(".thunder-"+id).css("opacity","0");
				if(enemyhealthpoint(false,0)<=0 && winningbattle == false) {
					winningbattle = true;
					setTimeout(function(){winbattle(theparam(false,0),id);},0);
				}
			},300);
			skilldelay(id,mindelay);
		}
		else {
			$(".player-"+id).css("opacity","0.5");
			isinvuln(true,true);
			invulnerabilitydelay=setTimeout(function() {
				$(".player-"+id).css("opacity","1");
				isinvuln(true,false);
			},(3+skilllvl)*1000);
			skilldelay(id,mindelay+(3+skilllvl));
		}
		if(offhand=="Suitcase"){
			availablepotions=[12,13,14,15,16,26];
			selectedpotion=availablepotions[Math.floor(Math.random() * availablepotions.length)];
			usepotion(selectedpotion,id,false);
		}
	}
}
function usepotion(pid,id,havecooldown=true) {
	if(items[pid].owned>=1 || !havecooldown) {
		items[pid].owned--;
		checkpotionsbutton(id);
		thepotionname=items[pid].name.replace(" potion","");
		thepotionname=thepotionname.charAt(0).toUpperCase() + thepotionname.slice(1);
		$(".button-potion-"+pid+"-"+id).val("["+items[pid].owned+"] "+thepotionname);
		mindelay = 6
		if(pid==15) { mindelay=10+(instasused*5); instasused++; }
		if(pid==12) { mindelay = 3; }
		if(havecooldown){
			potiondelay(id,mindelay)
		}
		if(pid==12) {
			damage=50;
			hp=enemyhealthpoint(false,0);
			hp-=damage;
			if(hp<=0) {
				hp=0;
			}
			enemyhealthpoint(true,hp);
			$(".enemy-"+id+"-hp").html(hp.toLocaleString("en"));
			if(enemyhealthpoint(false,0)<=0) {
				setTimeout(function(){winbattle(theparam(false,0),id);},0);
			}
		}
		else if(pid==13) {
			enemyconfused(true,true);
		}
		else if(pid==14) {
			$(".player-"+id).css("opacity",0);
			isinvisible(true,true);
		}
		else if(pid==15) {
			if(typeof attacktimeout !== 'undefined') {
				clearTimeout(attacktimeout);
			}
			if(typeof healthtimeout !== 'undefined') {
				clearTimeout(healthtimeout);
			}
			if(typeof skilltimeout !== 'undefined') {
				clearTimeout(skilltimeout);
			}
			attackdelay(id,0);
			healthdelay(id,0);
			skilldelay(id,0);
		}
		else if(pid==16) {
			rand = Math.round(Math.random()*(100+Math.floor(items[3].owned/3.5)));
			myhealthpoint(true,rand);
			$(".player-"+id+"-hp").html(rand.toLocaleString("en"));
		}
		else if(pid==17) {
			prompt("What the...","MS4wMzkzfHwxMzc4ODMwNjMyODc2O05hTjsxMzgzMjM5MTM4NTc1fDAwMTEwMHwxOTI5ODUyNzY5LjA2MDA1NTs3MDY0MjEyNzE3NDkuMTAyMzs4Mjk3OzE5OzEzODI1NTk5NDIxLjg4MTQ0Mzs4MDstMTstMTswOzA7MDswOzY3OzQ3OTY5OzA7MDswOzB8MTI4LDEyOSw3Njg0NTM2MjE3LDA7MTA1LDEwNiwyMzc2Njc5MzIwLDA7MTAxLDEwMSw1NDE3MzU5OCwwOzEwMSwxMDEsMjM5MDExOTgxLDE7ODIsODIsNjEzNDEwODI2LDA7NTgsNTgsMTQxNDg4MTkyNiwwOzUwLDUwLDI4MzExMzI1NzIsMDs1MCw1MCw0MDU2NjYyNTI3MywwOzI3LDI3LDY2NDU0OTU1NDYwLDA7MTYsMTYsMjI3NzgyMzIwNDU0LDA7fDQ1MDM1OTk2MjczNzA0OTU7NDUwMzEwMDMzNzQyMjMzNTsyMjUxODM0MTczNDAxNzAzOzM5NDA2NDk2NzM5NTk5MzU7MjI1MTc5OTk0NTgwNTk2MzsxMzc0Mzg5NTM0NzN8NDUwMzA0Nzc5MTA4MzUxOTsyMzkyODE2NzQwMTEyMDkxOzEwMjU%3D%21END%21");
		}
		else if(pid==18) {
			rand=Math.round(Math.random()*1000);
			$(".you-"+id).html('Player-'+rand);
			$(".you-desc-"+id).html('Player number '+rand);
			checkthings();
		}
		else if(pid==26) {
			berserked = true;
		}
	}
}
function potiondelay(id,sec) {
	if(sec!=0) {
		$("[class^=button-potion-]").attr("disabled",true);
		$(".potion-countdown-"+id).html("("+sec+" sec)");
		sec--;
		timeoutdelay = 1000;
		if(offhand == "Watch"){
			timeoutdelay = timeoutdelay * 0.95;
		}
		potiontimeout = setTimeout(function(){potiondelay(id,sec);},timeoutdelay);
	}
	else {
		$("[class^=button-potion-]").removeAttr("disabled");
		$(".potion-countdown-"+id).html("");
		potiontimeout = undefined;
	}
}
function skilldelay(id,sec) {
	if(sec!=0) {
		$(".button-skill-"+id).attr("disabled",true);
		$(".button-skill-"+id).attr("value","Use skill ("+sec+")");
		sec--;
		timeoutdelay = 1000;
		if(offhand == "Watch"){
			timeoutdelay = timeoutdelay * 0.95;
		}
		skilltimeout=setTimeout(function(){skilldelay(id,sec);},timeoutdelay);
	}
	else {
		$(".button-skill-"+id).removeAttr("disabled");
		$(".button-skill-"+id).attr("value","Use skill");
		skilltimeout = undefined;
	}
}
function healthdelay(id,sec) {
	if(sec!=0) {
		$(".button-health-"+id).attr("disabled",true);
		$(".button-health-"+id).attr("value","["+items[7].owned+"] Health Potion ("+sec+")");
		sec--;
		timeoutdelay = 1000;
		if(offhand == "Watch"){
			timeoutdelay = timeoutdelay * 0.95;
		}
		healthtimeout=setTimeout(function(){healthdelay(id,sec);},timeoutdelay);
	}
	else {
		$(".button-health-"+id).removeAttr("disabled");
		$(".button-health-"+id).attr("value","["+items[7].owned+"] Health Potion");
		healthtimeout = undefined;
	}
}

// stop all of the background timers for the current battle
function stop_battle_timers() {
	// it is expected that the enemy is either attacking or preparing to attack; put a stop to that immediately.
	if (typeof enemy_attack_timer !== 'undefined') { clearTimeout(enemy_attack_timer); enemy_attack_timer = undefined; }

		if(typeof attacktimeout !== 'undefined') {
			clearTimeout(attacktimeout);
			attacktimeout = undefined;
		}
		if(typeof healthtimeout !== 'undefined') {
			clearTimeout(healthtimeout);
			healthtimeout = undefined;
		}
		if(typeof skilltimeout !== 'undefined') {
			clearTimeout(skilltimeout);
			skilltimeout = undefined;
		}
		if(typeof invulnerabilitydelay !== 'undefined') {
			clearTimeout(invulnerabilitydelay);
			invulnerabilitydelay = undefined;
		}
}

// perform cleanup at the end of the battle, regardless of outcome
function battle_ended() {
	// signal to others that the battle has ended
	battlestop(true, true);
	stop_battle_timers();
	removeBattle(battleid);
	battleid++;
}

function myhealthpoint(set,health) { if(!set) { return myhp; } else { myhp=health; } }
function enemyhealthpoint(set,health) { if(!set) { return enemyhp; } else { enemyhp=health; } }
function enemyhealthpoint2(set,health) { if(!set) { return enemyhp2; } else { enemyhp2=health; } }
function theparam(set,param) { if(!set) { return theparameter; } else { theparameter=param; } }
function isinvuln(set,invuln) { if(!set) { return invulncond; } else { invulncond=invuln; } }
function battlestop(set,stop) { if(!set) { return isstop; } else { isstop=stop; } }
function enemyconfused(set,confused) { if(!set) { return isconfused; } else { isconfused=confused; } }
function isinvisible(set,invisibility) { if(!set) { return amiinvisible; } else { amiinvisible=invisibility; } }
function theenemyascii(set,asciiartno) { if(!set) { return theasciiartno; } else { theasciiartno=asciiartno; } }
function theenemyname123(set,enemyname) { if(!set) { return theenemyname; } else { theenemyname=enemyname; } }
function winbattle(param,id) {
	$(".flee-button").attr("disabled",true);
	setTimeout(function() {winningbattle = false;}, 2000);
	myfinalhp=myhealthpoint(false,0);
	myhealthpoint(true,100+Math.floor(items[3].owned/3.5));
	battle_ended();
	if(param=="vs-thief") {
		passthief=true;
		closemessage();
		makealert("new-shop","Thanks!","Hi, I'm Andrew! Thanks for helping us kill the thief!<br>By the way, I just finished setting up my new shop - maybe you'd want to buy something!<br><br>You got a new offhand item - the Thief's Dagger!",true);
		checkthings();
	}
	else if(param=="vs-worms"){
		passworms=true;
		closemessage();
		makealert("underground-world","Underground World!","Wow! You discovered an underground world! :o",true);
		checkthings();
	}
	else if(param=="training"){
		closemessage();
		additionalattack+=1;
		checkthings();
	}
	else if(param=="vs-monster"){
		closemessage();
		unlockenchant=true;
		makealert("enchant-unlocked","Enchanting shop","You can now visit the enchanting shop and enchant your sword!<br>The owner of the enchanting shop gave you 1,000 gold bars as a reward for slaying the fearsome beast.",true);
		goldbar+=1000;
	}
	else if(param=="vs-ghost"){
		closemessage();
		unlockchest=true;
chest='\n\
   __________\n\
  /\\____;;___\\\n\
 | /         /\n\
 `. ())oo() .\n\
  |\\(%()*^^()^\\\n\
 %| |-%-------|\n\
% \\ | %  ))   |\n\
%  \\|%________|\n\
 %%%%';
		goldbar+=2500;
		html="<div class=\"alert alert-chest-unlocked\"><b>A Chest!</b><br>The chest contains 2,500 gold bars and an ancient scroll.<br><br><pre>"+chest+"</pre><br><br><input type=\"button\" value=\"Read scroll\" class=\"mediumbutton\" onclick=\"readscroll()\"></div>";
		items[8].owned=1;
		$("#otheralerts").append(html);
		closemessage();
		$(".alert-chest-unlocked").fadeIn("fast");
	}
	else if(param=="vs-castle-guard"){
		$(".buttons-"+id).hide();
		setTimeout(function(){
			closemessage();
			castlegotohall(myfinalhp);
		},2000);
	}
	else if(param=="vs-castle-staff"){
		$(".buttons-"+id).hide();
		setTimeout(function(){
			closemessage();
			castlegotoking(myfinalhp);
		},2000);
	}
	else if(param=="vs-castle-boss"){
		closemessage();
		if(beatboss) {
			makealert("castle-beated","Yay!","You have defeated the boss again! The cubes, however, are absent.",true);
		}
		else {
			makealert("castle-beated","Yay!","Thank you for defeating our tyrranical ruler!<br>Our weapons forge is now open to you - feel free to drop in at any time!<br>You can have these 14 conveniently-shaped obsidian cubes he left lying around - we won't need them anymore. Good luck out there!",true);
			beatboss=true;
			items[9].owned=14;
		}
	}
	else if(param.slice(0,14)=="in-the-nether-"){
		$(".buttons-"+id).hide();
		param=param.replace('in-the-nether-','');
		param++;
		setTimeout(function(){
			enterportal(param,myfinalhp);
		},2000);
	}
	else if(param=="vs-devil"){
		closemessage();
		items[10].owned+=1;
		makealert("get-lava-bucket","End of the Nether","You managed to get to the end of the nether, and you got 1 lava bucket.",true);
	}
	else if(param=="vs-invisible-bot"){
		if(defeatinvisiblebot) {
			makealert("no-more-items","No More Items :(","Sorry, I have no more items to give you :(",true);
		}
		else {
			defeatinvisiblebot=true;
			makealert("defeat-invisible","Congratulations!","Wow - I didn't expect you to actually do it! Well then, have some of my items, as promised!<br>I also have this really cool shiny gem that can make your weapon stronger - I hope this can be useful to you!<br>Good luck out there!",true);
			items[21].owned=1;
			items[22].owned=1;
			currentsword="Emerald Sword";
			goldbar+=10000;
			ironbar+=10000;
			for(i=11;i<=16;i++) {
				items[i].owned+=randomnumber(1,5);
			}
		}
	}
	else if(param=="vs-fox"){
scroll='\n\
   _______________________\n\
 =(__    ___      __     _)=\n\
   |                     |\n\
   |  The password is:   |\n\
   | Ring-ding-ding-ding |\n\
   |  -dingeringeding!   |\n\
   |                     |\n\
 =(_______________________)=\n\
';
		makealert("fox-scroll","A Scroll!","The fox dropped a scroll:<br><br><pre>"+scroll+"</pre>",true);
	}
	else if(param=="vs-boss"){
		win=true;
		$(".buttons-"+id).hide();
		$(".enemy-"+id+"-hp").html('1');
		setTimeout(function(){
			makealert("boss-win","Almost!","<div style='max-height:300px; overflow-y:auto;'>Just when you thought it was all over...<br><br>...the guy managed to get away.<br><br>But...<br><br>You have learned something...<br><br>Revenge won't solve any of your problems.<br><br>You have to acknowledge them and talk to others.<br><br>And since killing him won't solve the problem...<br><br>You choose to talk to the guy, instead.<br><br>It seems it was all just a big misunderstanding.<br><br>He wants to help you return back to the real world...<br><br>But, you chose to stay in this 'weird' world.<br><br>After all, you have done so many things here...<br><br>So, you learned to love this world.<br><br>You don't even think about going back anymore.<br><br>In other news, you got a new offhand item - the Professor's Watch!<br><br>In other <i>other</i>news, the <b>Gate of Endless Glory</b> is now open! Check it out!<br><br><input type='button' value='Venture forth!' onclick='closemessage()' class='mediumbutton'></div>",true);
			$(".button-close-window-boss-win").hide();
		},2000);
	}
	else if(param=="vs-rat"){
		closemessage();
		reward=enemyhealthpoint2(false,0);
		goldbar+=reward;
		if(!buyfactory){
			makealert("win-vs-rat","Goodbye, Rat!","You killed the rat, and your boss gave you "+reward+" gold bars!<br><br><input type='button' value=\"Kill more rats!\" class='mediumbutton' onclick='battlevsrats()'>",true);
		}
		else{
			makealert("win-vs-rat","Goodbye, Rat!","You killed the rat, and you found it hoarding "+reward+" gold bars!<br><br><input type='button' value=\"Kill more rats!\" class='mediumbutton' onclick='battlevsrats()'>",true);
		}
	}
	else if(param=="vs-golem"){
		closemessage();
		reward=Math.ceil(enemyhealthpoint2(false,0)/10);
		makealert("win-vs-rat","Goodbye, Golem!","You killed the golem, and it shattered into "+reward+" iron bars!<br><br><input type='button' value=\"Kill more golems!\" class='mediumbutton' onclick='battlevsgolems()'>",true);
	}
	else if(param=="vs-shark"){
		closemessage();
		checkthings();
	}
	else if(param=="vs-endless-gate"){
		endlesswave++;
		closemessage();
		checkthings();
		reward=enemyhealthpoint2(false,0);
		goldbar+=reward;
		ironbar+=Math.floor(reward/2);
	}
	if(param!="vs-rat" && param!="training"){
		reward=enemyhealthpoint2(false,0);
		goldbar+=reward;
	}
	if(param!="training" && additionalattack > 0){
		additionalattack--;
	}

}

/* DIGGING SYSTEM */

function dig(countdown,cheat) {
	if(items[1].owned>0 || cheat || digcountdown <= 100) {
		if(countdown) {
			if(digcountdown >= 100) {
				digcountdown=5+digstep*5;
				closemessage();
				dig(true,false);
				digabcd=setInterval(function(){digcountdown--;},60000);
			}
			else {
				makealert("dig-countdown","Digging","You are currently digging.<br>Time left: <span class='digcd'>"+digcountdown+"</span> 	minute(s) remaining.<br>You can use extra shovels to dig faster!<br><br><input type='button' value='Use another shovel' onclick='hurrydig()' class='mediumbutton' id='hurry-dig-button'>",true);
				checkthings();
			}
			return;
		}
		if(digstep==0) {
			digstep++;
			$(".digging").removeClass("hidden");
			$(".small-hole").css("left","775px");
			if(!cheat) { closemessage(); }
		}
		else if(digstep==1) {
			digstep++;
			$(".dig-get-chest").removeClass("hidden");
			$(".small-hole").css("left","992px");
			if(!cheat) { closemessage(); }
		}
		else if(digstep==2) {
			digstep++;
			$(".dig-pizzas").removeClass("hidden");
			$(".small-hole").css("left","1192px");
			if(!cheat) { closemessage(); }
		}
		else if(digstep==3) {
			digstep++;
			$(".dig-laptop").removeClass("hidden");
			$(".small-hole").css("left","1442px");
			$(".small-hole").css("width","50px");
			if(!cheat) { closemessage(); }
		}
		else if(digstep==4) {
			digstep++;
			$(".dig-sign").removeClass("hidden");
			$(".small-hole").css("left","1692px");
			$(".small-hole").css("width","50px");
			$(".small-hole").css("cursor","default");
			$(".small-hole").css("title","");
			if(!cheat) { closemessage(); }
		}
	}
	else {
		closemessage();
		makealert("no-shovel","No shovel?","It seems that you have no shovel. How, exactly, are you trying to dig?",true);
	}
}

function hurrydig()
{
	if(items[1].owned > 0) {
		items[1].owned--;
		digcountdown--;
		checkthings();
	}
}
/* POTIONS MAKING SYSTEM */

var validitems = [7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function updateitemlist() {
	$("#itemlist").html('');
	current=$("#itemlist").html();
	$("#itemlist").html(current+'<option value="goldbar">Gold bar ['+goldbar.toLocaleString("en")+']</option>');
	current=$("#itemlist").html();
	$("#itemlist").html(current+'<option value="ironbar">Iron bar ['+ironbar.toLocaleString("en")+']</option>');
	for(i=0;i<items.length;i++) {
		current=$("#itemlist").html();
		item=items[i];
		if(item.owned!=0 && validitems.includes(i)) {
			$("#itemlist").html(current+'<option value="'+i+'">'+item.name+' ['+item.owned.toLocaleString("en")+']</option>');
		}
	}
	//setTimeout(function(){updateitemlist();},100);
}
function thecauldron(act,id,quantity) {
	if(act=="make") {
		cauldron=[];
	}
	else if(act=="add") {
		cauldron.push({"id":id,"quantity":quantity});
	}
	else if(act=="show") {
		$("#goingtobemixed").html('');
		for(i=0;i<cauldron.length;i++) {
			thehtml=$("#goingtobemixed").html();
			now=cauldron[i];
			if(now.id=="goldbar") {
				$("#goingtobemixed").html(thehtml+"<br>"+now.quantity.toLocaleString("en")+" gold bar(s)");
			}
			else if(now.id=="ironbar") {
				$("#goingtobemixed").html(thehtml+"<br>"+now.quantity.toLocaleString("en")+" iron bar(s)");
			}
			else {
				$("#goingtobemixed").html(thehtml+"<br>"+now.quantity.toLocaleString("en")+" "+items[now.id].name+"(s)");
			}
		}
	}
	else if(act=="return") {
		return cauldron;
	}
}
function putitem() {
	let wontput = false;
	quantity=$("#quantity").val();
	theitem=$("#itemlist").val();
	if(!isNaN(parseFloat(quantity)) && parseFloat(quantity) != "") {
		quantity=Math.abs(Math.round(parseFloat(quantity)));
		if(theitem=="goldbar") {
			if(quantity>goldbar) {
				wontput = true;
			}
			else {
				goldbar-=quantity;
			}
		}
		else if(theitem=="ironbar") {
			if(quantity>ironbar) {
				wontput = true;
			}
			else {
				ironbar-=quantity;
			}
		}
		else {
			item=items[theitem];
			if(quantity>item.owned) {
				wontput = true;
			}
			else {
				item.owned-=quantity;
			}
		}
		if(wontput) {
			alert("You don't have that many!");
		}
		else {
			thecauldron("add",theitem,quantity);
			thecauldron("show",0,0);
			updateitemlist();
		}
	}
}

// Just some random comment's brother :)

function getIngredientQuantity(cldr, id) {
	id = id.toString();
	let total = 0;
	for (let i = 0; i < cldr.length; i++) {
		if (cldr[i].id.toString() === id) {
			total += cldr[i].quantity;
		}
	}
	return total;
}

function onlyContains(cldr, allowedIds) {
	const allowed = allowedIds.map(id => id.toString());
	for (let i = 0; i < cldr.length; i++) {
		if (!allowed.includes(cldr[i].id.toString())) {
			return false;
		}
	}
	return true;
}

function emptyCauldron() {
	let cldr = thecauldron("return", 0, 0);

	for (let i = 0; i < cldr.length; i++) {
		let item = cldr[i];
		let id = item.id.toString();
		let quantity = item.quantity;

		if (id === "goldbar") {
			goldbar += quantity;
		} else if (id === "ironbar") {
			ironbar += quantity;
		} else if (items[id]) {
			items[id].owned += quantity;
		}
	}

	thecauldron("make"); // Clear cauldron
	thecauldron("show");
	updateitemlist();
}

function mixitems() {
	let cldr = thecauldron("return", 0, 0);
	let madeitem = true;
	let qty = {};
	let allIds = ["goldbar", "ironbar", "7", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"];

	for (let id of allIds) {
		qty[id] = getIngredientQuantity(cldr, id);
	}

	if (qty["7"] && qty["goldbar"] && qty["goldbar"] % 100 === 0 && qty["7"] % 1 === 0 &&
		onlyContains(cldr, ["7", "goldbar"])) {
		if (qty["goldbar"] / 100 === qty["7"]) {
			alert('You made ' + (qty["goldbar"] / 100) + ' empty potion(s)!');
			items[11].owned += qty["goldbar"] / 100;
		}	
	}

	else if (qty["11"] && qty["7"] && qty["ironbar"] &&
		qty["11"] === qty["7"] && qty["7"] === (qty["ironbar"] / 100) &&
		onlyContains(cldr, ["11", "7", "ironbar"])) {
		alert('You made ' + (qty["ironbar"] / 100) + ' poison potion(s)!');
		items[12].owned += qty["ironbar"] / 100;
	}

	else if (qty["12"] && qty["goldbar"] && qty["goldbar"] % 200 === 0 &&
		qty["goldbar"] / 200 === qty["12"] &&
		onlyContains(cldr, ["12", "goldbar"])) {
		alert('You made ' + (qty["goldbar"] / 200) + ' confusion potion(s)!');
		items[13].owned += qty["goldbar"] / 200;
	}

	else if (qty["11"] && qty["ironbar"] && qty["ironbar"] % 500 === 0 &&
		qty["ironbar"] / 500 === qty["11"] &&
		onlyContains(cldr, ["11", "ironbar"])) {
		alert('You made ' + (qty["ironbar"] / 500) + ' invisibility potion(s)!');
		items[14].owned += qty["ironbar"] / 500;
	}

	else if (qty["11"] && qty["19"] && qty["goldbar"] &&
		qty["goldbar"] % 2000 === 0 && qty["19"] % 20 === 0 &&
		qty["goldbar"] / 2000 === qty["11"] && qty["19"] / 20 === qty["11"] &&
		onlyContains(cldr, ["11", "19", "goldbar"])) {
		alert('You made ' + (qty["goldbar"] / 2000) + ' instant countdown potion(s)!');
		items[15].owned += qty["goldbar"] / 2000;
	}

	else if (
		qty["11"] === 1 && qty["12"] === 1 && qty["13"] === 1 &&
		qty["14"] === 1 && qty["15"] === 1 && qty["16"] === 1 &&
		qty["17"] === 1 && qty["26"] === 1 && qty["goldbar"] === 100000 && qty["ironbar"] === 100000 &&
		onlyContains(cldr, ["11", "12", "13", "14", "15", "16", "17", "26", "goldbar", "ironbar"])
	) {
		alert('You made an X potion :o');
		items[18].owned++;
	}

	else if (qty["11"] && qty["12"] && qty["13"] &&
		qty["11"] === qty["12"] && qty["12"] === qty["13"] &&
		onlyContains(cldr, ["11", "12", "13"])) {
		alert('You made ' + qty["11"] + ' gambler\'s potion(s)!');
		items[16].owned += qty["11"];
	}

	else if (qty["11"] && qty["19"] && qty["19"] % 500 === 0 &&
		qty["19"] / 500 === qty["11"] &&
		onlyContains(cldr, ["11", "19"])) {
		alert('You made ' + (qty["19"] / 500) + ' cookie potion(s)!');
		items[17].owned += qty["19"] / 500;
	}

	else if (qty["goldbar"] === 1 && qty["ironbar"] === 1 && qty["7"] === 1 &&
		onlyContains(cldr, ["goldbar", "ironbar", "7"])) {
		alert('You made a secret potion!');
		items[20].owned++;
	}
	else if (qty["10"] && qty["11"] && qty["10"] === qty["11"] &&
		onlyContains(cldr, ["10", "11"])) {
		alert('You made ' + qty["10"] + ' berserk potion(s)!');
		items[26].owned += qty["10"];
	}


	else if (qty["ironbar"] && qty["ironbar"] % 10 === 0 &&
		onlyContains(cldr, ["ironbar"])) {
		alert('You made ' + (qty["ironbar"] / 10) + ' shuriken(s)!');
		items[25].owned += qty["ironbar"] / 10;
	}

	else {
		alert('You made nothing. To make multiple potions, make sure to multiply ALL ingredients needed!');
		madeitem = false;
	}
	if(madeitem){
		thecauldron("make", 0, 0);
	}
	thecauldron("show", 0, 0);
	updateitemlist();
}

function makebosshappy() {
	closemessage();
	makealert("how-to-make-boss-happy","Make your boss happier","To make him happier and get some extra gold bars, you can do these things:<br><br><input type='button' value='Kill some rats that sometimes enter the factory at night' onclick='killrats()'><br><input type='button' value='Help him decipher messages' onclick='ciphercode()'>",true);
}
function killrats() {
	if(items[2].owned==0) {
		closemessage();
		makealert("no-weapon","No weapon?","Oh snap! It seems that you don't have a weapon, so you can't really kill the rats.",true);
	}
	else {
		closemessage();
		makealert("kill-rats","Kill some rats!","Finding the rats is not a big deal - the problem is that these rats can fight back!<br><br><input type='button' value=\"I'm ready!\" class='mediumbutton' onclick='battlevsrats()'>",true);
	}
}
function killgolems() {
	closemessage();
	makealert("kill-golems","Kill some golems!","These guys have been forming out of the iron in this mine for a long time. Now's your chance to get some!<br><br><input type='button' value=\"I'm ready!\" class='mediumbutton' onclick='battlevsgolems()'>",true);
}

function ciphercode() {

	closemessage();

	if(cipherstep==0) {
		codetocipher="13-1-19-20-5-18 2-18-1-14-3-8";
	}
	else if(cipherstep==1) {
		codetocipher="Lzwjw ak s ljwskmjw zavvwf kgewozwjw, al ak dguslwv sl s kwujwl hdsuw af lzw Hsuaxau Guwsf";
	}
	else if(cipherstep==2) {
		codetocipher=".-. . --. .. .-.. -.. . -..";
	}
	else if(cipherstep==3) {
		codetocipher="Om s ept;f gi;; pg n;pvld";
	}
	else if(cipherstep==4) {
		codetocipher="⠞⠓⠑⠀⠕⠞⠓⠑⠗⠀⠅⠊⠝⠙⠀⠕⠋⠀⠙⠕⠞⠎";
	}
	else if(cipherstep==5) {
		codetocipher="VGhlIHBsYW50IGlzIGZhbW91cyBiZWNhdXNlIG9mIHR<br>oZSBhYmlsaXR5IHRvIGN1cmUgc29tZSBkaXNlYXNlcw==";
	}
	else if(cipherstep==6) {
		codetocipher="43 24 33 33 15 43 31 34 43 13 23 15 33";
	}
	else if(cipherstep==7) {
		codetocipher="towiiag g se&nbsp;&nbsp;&nbsp;rir,oaoan&nbsp;&nbsp;&nbsp;ft ofo srtod tddyi ot mdy lugelelmwon foemsthiuaa ttclntclga&nbsp;&nbsp;bhhs";
	}
	else if(cipherstep==8) {
		codetocipher="Li4uLiAuLS0tIC4uLiAuLi0gLi0uLiAuLSAuLi0gLi0tIC8gLiAuLi4gLS4<br>tLiAuLS0gLS4tIC8gLi4uLiAuLS0gLi0tLSAtLi4tIC4tLSAuLi0gLi0uLg==";
	}
	if(cipherstep<9) {
		if(!buyfactory) {
			makealert("help-ciphering","Decipher some messages","Your boss loves cryptography, but he isn't very good at it. If you can help him, he promises to give you extra gold bars as a reward!<br><br>Code #"+(cipherstep+1)+":<br>"+codetocipher+"<br><input type='text' id='cipherthecodeanswer'><br><br><input type='button' value='Submit' class='smallbutton' onclick='checkcipher()'><input type='button' value='Hint' class='smallbutton' onclick='gethint()'>",true);
		}
		else {
			makealert("help-ciphering","Decipher some messages","Your old boss left you a book with some codes. He promises to keep rewarding you, as long as you keep solving them!<br><br>Code #"+(cipherstep+1)+":<br>"+codetocipher+"<br><input type='text' id='cipherthecodeanswer'><br><br><input type='button' value='Submit' class='smallbutton' onclick='checkcipher()'><input type='button' value='Hint' class='smallbutton' onclick='gethint()'>",true);
		}
	}
	else {
		makealert("no-more-codes","No more codes!","There are no more messages to decipher!",true);
	}
}
function battlevsrats() {
	if(items[2].owned!=0) {
		closemessage();
		powerhp();
		hpdivide=Math.ceil(hp/4.5);
		battle=makebattle(battleid,"A Rat",hp-hpdivide,hp-hpdivide,"Its body",basepower-Math.ceil(basepower/2.5),"An annoying rat.",11,power,hp,hp,currentsword,false,"vs-rat");
		html="<div class=\"alert alert-battle-rats\"><b>Rat!</b><br>Kill it!!<br><br>"+battle.html+"</div>";
		$("#otheralerts").append(html);
		battle.init();
		$(".alert-battle-rats:last").fadeIn("fast");
	}
}
function battlevsgolems() {
	if(items[2].owned!=0) {
		closemessage();
		powerhp();
		hpdivide=Math.ceil(hp/5);
		battle=makebattle(battleid,"Iron Golem",hp+hpdivide,hp+hpdivide,"Iron Hands",basepower+Math.ceil(basepower/5),'Bringing a new meaning to "cold iron."',5,power,hp,hp,currentsword,false,"vs-golem");
		html="<div class=\"alert alert-battle-golems\"><b>Golem!</b><br>Destroy it!<br><br>"+battle.html+"</div>";
		$("#otheralerts").append(html);
		battle.init();
		$(".alert-battle-golems:last").fadeIn("fast");
	}
}
function checkcipher() {

	let wrongmessage = "Incorrect!";

	if(cipherstep==0) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="master branch") {
			cipherstep++;
			goldbar+=100;
			closemessage();
			alert("Correct! Since this is an easy one, you only get 100 gold bars.");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==1) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="there is a treasure hidden somewhere, it is located at a secret place in the pacific ocean") {
			cipherstep++;
			goldbar+=250;
			closemessage();
			alert("Correct! You get 250 gold bars!");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==2) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="regilded") {
			cipherstep++;
			items[7].owned += 5;
			closemessage();
			alert("Correct! You get 5 health potions!");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==3) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="in a world full of blocks") {
			cipherstep++;
			goldbar+=500;
			closemessage();
			alert("Correct! You get 500 gold bars!");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==4) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="the other kind of dots") {
			cipherstep++;
			ironbar+=50;
			closemessage();
			alert("Correct! You get 50 iron bars!");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==5) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="the plant is famous because of the ability to cure some diseases") {
			cipherstep++;
			goldbar+=750;
			closemessage();
			alert("Correct! You get 750 gold bars!");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==6) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="sinnesloschen") {
			cipherstep++;
			items[12].owned += 3;
			closemessage();
			alert("Correct! You get 3 poison potions! Use them wisely!");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==7) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="the gold factory was built long time ago, and it is the most famous gold factory in the world") {
			cipherstep++;
			goldbar+=1000;
			closemessage();
			alert("Correct! Because this is a hard one, you get 1,000 gold bars!");
			ciphercode();
		}
		else {
			alert(wrongmessage);
		}
	}
	else if(cipherstep==8) {
		if($("#cipherthecodeanswer").val().toLowerCase()=="practice makes perfect") {
			cipherstep++;
			items[15].owned += 1;
			closemessage();
			alert("That's all, folks! You get an instant countdown potion - be careful with it!");
		}
		else {
			alert(wrongmessage);
		}
	}
}

function gethint() {
	let hints = ["Hint: ABC, Its easy as 123!", "Hint: The Romans would be furious with you!", "Hint: Save Our Souls!", "Hint: You use this to type!", "Hint: Who even needs vision, anyway?", "Hint: (8*4) - 16 + ((24/2) * 4)", "Hint: Square coordinates!", "Hint: You know the rails and the fence? Combine them and keep going! There may be multiple stops.", "Hint: Use everything you've learned! You've got this!"];
	alert(hints[cipherstep]);
}

function calculateTotalPrice(currentMachines, machinesToBuy, divisor) {
    let totalPrice = 0;
    for (let i = 0; i < machinesToBuy; i++) {
        const price = 10 + Math.floor((currentMachines + i) * (currentMachines + i) / divisor);
        totalPrice += price;
    }
    return totalPrice;
}

function removeBattle(id)
{
	setTimeout(function(){document.getElementById("battle-"+id).remove();}, 2000);
	setTimeout(function(){document.querySelector(".buttons-"+id).remove();}, 2000);
}