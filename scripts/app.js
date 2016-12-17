var myApp = angular.module('myApp',['ui.router']);



myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: 'partials/partial-home.html',
            controller: function ($scope, $stateParams, $rootScope) {
            
            }  
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('tiles', {
            url: '/tiles',
            templateUrl: 'partials/partial-tiles.html',
            controller: function ($scope, $stateParams, $rootScope, $state) {
           		  $rootScope.modalShown = true;
					  $rootScope.toggleModal = function() {
					    $rootScope.modalShown = !$rootScope.modalShown;
					  };

   
				  $rootScope.textDisplay = 0;  
				  $rootScope.compareCounter = 0;

				  var timeoutHandle = window.setTimeout(function(){
				  	$state.go('home').then(function(){
				  				window.location.reload(true);
				  			})
				  }, 1000 * 600);


				  $(window).on('click', function(e){
				  	window.clearTimeout(timeoutHandle);
				  	timeoutHandle = window.setTimeout(function(){
				  			$state.go('home').then(function(){
				  				window.location.reload(true);
				  			})

				  		}, 1000 * 600);
				  });

            }       
        })

        
});


myApp.controller('MainController', function($scope) {
  $scope.greeting = 'Hola!';
});

myApp.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});


myApp.controller('MyCtrl', function($scope) {
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
});


myApp.directive('modalDialog', function($rootScope, $state) {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
    	$rootScope.begin = false;
      $rootScope.hideModal = function() {
        scope.show = false;
 		// $rootScope.firstSlide = true;
        $rootScope.begin = true;
        var tile = $('.tile')[0];
    	var newEl = $(tile).clone().appendTo($('body'));

    	var tile1 = $('.tile')[1];
    	var newEl1 = $(tile1).clone().appendTo($('body'));

    	var tile2 = $('.tile')[2];
    	var newEl2 = $(tile1).clone().appendTo($('body'));

    		setTimeout(function(){
    			$(newEl).css({'position':'absolute',
  					   'width': $(window).width(),
  					   	'height': ($(window).width() / 16) * 9,
  					   	'top':0,
  					   	 'left':0,
  					   	 'margin': '0'});
    			
    		}, 10);



    		setTimeout(function(){
    			loadCanvas(scope, $rootScope, newEl, newEl1, newEl2);
    			setTimeout(function(){
    				$(newEl).hide();
    			},100);
    		},500);
      };

      $rootScope.compareScreen = function() {
        
        // $rootScope.firstSlide = false;
        $('.tile').hide();
        $rootScope.minimizeScreen = true;
        // scope.show = false;
        scope.show = false;
        demoIsRunning = false;
        console.log(scope);
      };

      $rootScope.swapScreen = function(year) {
      		scope.show = false;
      		if(year == 1965){
      			$rootScope.switchScreen = true;

      		}else{
      			$rootScope.switchLastScreen = true;
      		}
      }

      $rootScope.returnHome = function(){
      	if($rootScope.compareCounter == 1){
      		scope.show = false;
      	}else{
      		$rootScope.goHome = true;
      	}
      	$rootScope.compareCounter++;
      }

      $rootScope.playAgain = function(){
      	$state.go('tiles').then(function(){
      		location.reload();
      	});

      }



    },
    templateUrl: 'partials/modal-template.html' // See below
  };
});



var nextClicked = false;

myApp.directive('nextButton', function($rootScope, $state) {
  return {
    link: function(scope, element, attrs) {
    	$(element).on('click', function(){
    		nextClicked = true;
    		$rootScope.firstSlide = false;
    		$rootScope.$apply();
    	})
    	
    }
}
});






loadCanvas = function(modalScope, $rootScope, myElement, myElement1, myElement2){

	var b = function(p) {

		var hit = false;
		var bg;
		var hitTracker = {};
		var xPos;
		var yPos;
		var poly = [];
		var polyParams = [];
	    var barn = [];
	    var barnParams = [];    
		var itemsFound = [];
		var hitParams = [];
		var currentSize = 5;
		var bestSize = 5;
		var sizeIncrement = 0.5;
		var w = 200;
		var h = 250;
		var textBoxHeight = 50;
		var demoIsRunning = true;


		p.preload = function() {
			bg = p.loadImage("images/farm_01.jpg");	
			gradient = p.loadImage("images/gradient.jpg");	
			overlay = p.loadImage("images/overlays_01/1.png"); 
			myFont = p.loadFont('images/POORICH.TTF');
			corbel = p.loadFont('images/corbel.ttf');

		}

		var canvas;
		p.setup = function(){
			canvas = p.createCanvas(p.windowWidth, (p.windowWidth / 16) * 9);
		    canvas.parent('sketch-holder');
			reSetup();
		}



		var screenSelected = 0;
		var silhouettes = [];
		function reSetup(newDiv, currScreen){
		  $rootScope.selectedText = false;
		  $rootScope.firstSlide = false;	
		  demoIsRunning = false;
		  var divisor = newDiv ? newDiv : 1;
		  var currentScreen = currScreen ? currScreen : 0;
		  screenSelected = currentScreen;
		  poly = [];
		  polyParams = [];
		  barn = [];
		  barnParams = [];
		  itemsFound = [];
		  silhouettes = [];


		  
		  
		  xPos = function(input){
		  	return p.map(input, 0, 100, 0, p.windowWidth / divisor);
		  }
		  yPos = function(input){
		  	return p.map(input, 0, 100, 0, ((p.windowWidth / 16) * 9) / divisor);	
		  }



		  	var coords = {
			  '0': {
				'barnParams' : [
				  [[xPos(35.70784490532011), yPos(46.48832782286344)],[xPos(28.584310189359783), yPos(40.87766756837992)],[xPos(28.67448151487827), yPos(34.30517984169923)],[xPos(35.43733092876465), yPos(39.43492636008416)],[xPos(37.150586113615866), yPos(34.946398156497345)],[xPos(38.14247069431921), yPos(32.86243863340347)],[xPos(39.31469792605951), yPos(31.580002003807234)],[xPos(40.5770964833183), yPos(32.70213405470393)],[xPos(42.11000901713255), yPos(36.22883478609358)],[xPos(42.29035166816952), yPos(43.282236248872856)]],
				  [[xPos(39.224526600541026), yPos(31.580002003807234)],[xPos(38.14247069431921), yPos(32.22122031860535)],[xPos(37.330928764652846), yPos(33.34335236950206)],[xPos(35.43733092876465), yPos(38.95401262398558)],[xPos(28.22362488728584), yPos(33.34335236950206)],[xPos(30.027051397655548), yPos(28.694519587215712)],[xPos(31.74030658250676), yPos(25.648732591924656)],[xPos(38.412984670874664), yPos(30.61817453161006)]]
				  ],

				  'year':'1940',

				  'names' : [
				  	'Barn',
				  	'Milk House',
				  	'Corn Crib',
				  	'Portable Elevator',
				  	'Chicken House',
				  	'Machine Shop',
				  	'Farm House',
				  	'Machine Shop',
				  	'Chicken House',
				  	'Brooder House',
				  	'Lean to Shed',
				  	'Farm Land'
				  ],

				 'hitParams' : [
				 	[xPos(34.44338725023787), yPos(36.198329633153605)],
				 	[xPos(48.43006660323502), yPos(44.82503435881171)],
				 	[xPos(27.783063748810655), yPos(46.00909187017655)],
				 	[xPos(20.742150333016173), yPos(49.730415477323184)],
				 	[xPos(37.96384395813511), yPos(59.372026641294006)],
				 	[xPos(51.28449096098954), yPos(49.561264404271064)],
				 	[xPos(66.88867745004757), yPos(50.068717623427425)],
				 	[xPos(14.081826831588963), yPos(36.029178560101485)],
				 	[xPos(46.7174119885823), yPos(68.50618458610846)],
				 	[xPos(79.82873453853473), yPos(45.839940797124434)],
				 	[xPos(20.266412940057087), yPos(37.38238714451845)],
				 	[xPos(18.553758325404377), yPos(20.6364309123586)]


				 ], 
				
				'polyParams' : [
	     		  [[xPos(35.41300527240773), yPos(45.30365163054091)],[xPos(42.09138840070299), yPos(43.27279828158563)],[xPos(42.1792618629174), yPos(37.336457723100956)],[xPos(42.53075571177504), yPos(36.86779925795743)],[xPos(41.03690685413005), yPos(32.649873071665695)],[xPos(39.19156414762742), yPos(31.24389767623511)],[xPos(32.33743409490334), yPos(25.619996094512793)],[xPos(30.14059753954306), yPos(28.43194688537395)],[xPos(28.119507908611602), yPos(33.430970513571566)],[xPos(28.558875219683657), yPos(33.74340949033392)],[xPos(28.558875219683657), yPos(39.99218902558094)],[xPos(35.32513181019332), yPos(45.45987111892209)],[xPos(41.82776801405975), yPos(43.116578793204454)], 'The barn was used for the storage of hay for feeding livestock, as well as straw for livestock bedding. Ed Hartzold had about 18 cows that he milked in the barn.                  Hartzold also owned 2-4 horses that were used for labor and housed in the barn.'],
	     		  [[xPos(47.45166959578208), yPos(43.429017769966805)],[xPos(47.6274165202109), yPos(40.929505955867995)],[xPos(48.154657293497365), yPos(39.67975004881859)],[xPos(49.64850615114236), yPos(38.58621363015036)],[xPos(51.31810193321616), yPos(41.241944932630346)],[xPos(51.40597539543058), yPos(44.21011521187268)],[xPos(49.56063268892794), yPos(45.77231009568444)],[xPos(47.53954305799649), yPos(44.36633470025386)], 'The milk house was used to store and cool the milk. An expansion of the milk house was underway when this image was taken around 1943. Cream was sent to Bloomington via the Interurban (a rail system between Bloomington and Peoria, and Decatur and Bloomington), which had a stop 1/4 mile north of the farm. The milk, mixed with oats, was fed to the hogs.'],
	     		  [[xPos(24.340949033391915), yPos(37.64889669986331)],[xPos(27.06502636203866), yPos(38.58621363015036)],[xPos(32.51318101933216), yPos(44.21011521187268)],[xPos(32.42530755711775), yPos(49.521577816832654)],[xPos(26.449912126537782), yPos(52.17730911931263)],[xPos(22.056239015817223), yPos(48.428041398164424)],[xPos(23.81370826010545), yPos(45.30365163054091)],[xPos(26.62565905096661), yPos(41.08572544424917)],[xPos(26.01054481546573), yPos(40.46084749072447)],[xPos(21.441124780316343), yPos(46.55340753759031)],[xPos(21.704745166959576), yPos(43.58523725834798)],[xPos(21.17750439367311), yPos(42.8041398164421)],[xPos(24.340949033391915), yPos(37.96133567662566)], 'The corn crib was used to store ear corn. Above the central driveway there were three storage areas where Hartzold stored his oats. He also stored equipment in the driveway that ran through the middle of the crib.'],
	     		  [[xPos(23.44454463480613), yPos(51.7783789199479)],[xPos(23.53471596032462), yPos(50.816551447750726)],[xPos(21.911632100991884), yPos(49.21350566075544)],[xPos(26.420198376916144), yPos(41.51888588317804)],[xPos(25.969341749323714), yPos(41.19827672577898)],[xPos(20.468890892696123), yPos(48.41198276725779)],[xPos(19.47700631199279), yPos(48.73259192465685)],[xPos(17.853922452660054), yPos(51.13716060514979)],[xPos(20.468890892696123), yPos(54.343252179140364)], 'Portable elevators were used to move the ear corn into the corn crib after it had been picked with Hartzold’s one-row picker.'],
	     		  [[xPos(31.46979260595131), yPos(65.24396353070834)],[xPos(36.9702434625789), yPos(63.16000400761447)],[xPos(41.659152389540125), yPos(60.43482616972248)],[xPos(41.92966636609558), yPos(58.67147580402765)],[xPos(37.06041478809738), yPos(54.66386133653942)],[xPos(35.07664562669071), yPos(53.38142470694319)],[xPos(33.00270513976555), yPos(53.541729285642724)],[xPos(32.37150586113616), yPos(56.58751628093377)],[xPos(32.7321911632101), yPos(60.43482616972248)],[xPos(32.82236248872859), yPos(61.39665364191965)],[xPos(30.748422001803426), yPos(62.83939485021541)],[xPos(30.568079350766457), yPos(64.28213605851117)],[xPos(31.55996393146979), yPos(65.24396353070834)], 'This hen house was used to house egg-laying chickens.'],
	     		  [[xPos(47.15960324616772), yPos(47.28985071636109)],[xPos(52.29936880072137), yPos(44.56467287846909)],[xPos(52.66005410279531), yPos(44.404368299769565)],[xPos(54.102795311091064), yPos(45.84710950806532)],[xPos(55.09467989179441), yPos(48.091373609858735)],[xPos(55.18485121731289), yPos(50.97685602645026)],[xPos(55.18485121731289), yPos(53.70203386434225)],[xPos(54.01262398557258), yPos(54.5035567578399)],[xPos(49.32371505861136), yPos(56.427211702234246)],[xPos(45.807033363390445), yPos(53.38142470694319)],[xPos(45.98737601442741), yPos(48.892896503356376)],[xPos(46.70874661857529), yPos(47.77076445245967)],[xPos(49.50405770964833), yPos(46.48832782286344)],[xPos(52.02885482416592), yPos(45.52650035066627)], 'This two story building was constructed to house equipment while it was being repaired. It had a wind charger for generating electricity, as most rural areas of Illinois did not have power lines.  But it only worked when there was wind, and did not store electricity.'],
	     		  [[xPos(65.37421100090171), yPos(60.114217012323415)],[xPos(69.43192064923355), yPos(57.389039174431424)],[xPos(69.43192064923355), yPos(56.58751628093377)],[xPos(71.86654643823263), yPos(55.144775072638005)],[xPos(72.49774571686204), yPos(47.45015529506061)],[xPos(65.91523895401262), yPos(41.67919046187757)],[xPos(63.66095581605049), yPos(44.72497745716862)],[xPos(59.963931469792605), yPos(50.33563771165214)],[xPos(60.054102795311096), yPos(51.7783789199479)],[xPos(60.14427412082958), yPos(54.343252179140364)],[xPos(65.19386834986474), yPos(59.472998697525306)],[xPos(69.25157799819658), yPos(57.86995291053001)], 'The farm house existed on the property, along with a summer kitchen, when the land was purchased in 1867. In 1939 — just after electricity reached the farm — a kitchen addition with a second floor room and a porch were added to the house; and the summer kitchen was torn down. The family cooked and ate their meals in the upper story of the machine shop during the construction.'],
	     		  [[xPos(10.36970243462579), yPos(43.92345456367098)],[xPos(18.84580703336339), yPos(40.557058410980865)],[xPos(19.026149684400362), yPos(36.54944394349264)],[xPos(17.493237150586115), yPos(32.22122031860535)],[xPos(8.656447249774573), yPos(34.62578899909829)],[xPos(7.033363390441839), yPos(36.54944394349264)],[xPos(7.033363390441839), yPos(40.87766756837992)], 'This shed was used to store planting, cultivating, and harvesting equipment.'],
	     		  [[xPos(43.19206492335437), yPos(69.73249173429517)],[xPos(43.19206492335437), yPos(67.32792305380222)],[xPos(43.01172227231741), yPos(66.68670473900411)],[xPos(43.82326420198377), yPos(64.4424406372107)],[xPos(46.528403967538324), yPos(64.76304979460976)],[xPos(52.1190261496844), yPos(69.89279631299469)],[xPos(51.848512173128945), yPos(70.69431920649234)],[xPos(51.848512173128945), yPos(72.7782787295862)],[xPos(48.512173128944994), yPos(75.02254283137962)],[xPos(43.46257889990983), yPos(70.21340547039375)], 'Though the Hartzolds already had a chicken house, demand for eggs was high in town, so a second chicken house was built.'],
	     		  [[xPos(84.03967538322813), yPos(47.129546137661556)],[xPos(83.94950405770965), yPos(48.41198276725779)],[xPos(81.8755635707845), yPos(49.53411481815449)],[xPos(78.53922452660053), yPos(49.37381023945496)],[xPos(76.64562669071235), yPos(45.84710950806532)],[xPos(76.28494138863842), yPos(41.51888588317804)],[xPos(78.08836789900812), yPos(41.51888588317804)],[xPos(80.88367899008115), yPos(44.0837591423705)],[xPos(82.32642019837691), yPos(44.404368299769565)],[xPos(84.03967538322813), yPos(46.64863240156297)], 'The brooder house was used for raising chicks. Of the chickens the Hartzolds raised in the brooder houses, some were kept for laying eggs, some were eaten, and some went to market.'],
	     		  [[xPos(18.30477908025248), yPos(33.98457068430017)],[xPos(22.18214607754734), yPos(37.51127141568981)],[xPos(22.18214607754734), yPos(40.07614467488227)],[xPos(19.116321009918845), yPos(41.358581304478506)],[xPos(19.206492335437332), yPos(36.870053100891695)],[xPos(18.48512173128945), yPos(34.62578899909829)], 'This addition was made to the shed and used for farrowing hogs.  After the baby hogs were weaned from their mothers, they were moved to a hog lot located east of the timber (upper left corner of image). There, they were fed until they were ready for market. With the help of his sons (Joe, Bob, Dick, and Larry) Ed Hartzold raised between 70 and 80 hogs per year at the time.'],
	     		  [[xPos(0.26362038664323373), yPos(0)],[xPos(25.83479789103691), yPos(0)],[xPos(50.96660808435852), yPos(20.620972466315173)],[xPos(36.81898066783831), yPos(28.7443858621363)],[xPos(32.073813708260104), yPos(24.995118140988087)],[xPos(29.876977152899826), yPos(28.119507908611602)],[xPos(28.031634446397184), yPos(32.649873071665695)],[xPos(26.449912126537782), yPos(38.117555165006834)],[xPos(24.340949033391915), yPos(37.18023823471978)],[xPos(23.022847100175746), yPos(37.336457723100956)],[xPos(17.66256590509666), yPos(31.556336652997462)],[xPos(8.611599297012303), yPos(33.89962897871509)],[xPos(6.854130052724078), yPos(36.3991407928139)],[xPos(6.854130052724078), yPos(40.30462800234329)],[xPos(12.390158172231985), yPos(48.896699863307944)],[xPos(15.641476274165203), yPos(54.36438195664909)],[xPos(20.56239015817223), yPos(57.332552235891434)],[xPos(25.04393673110721), yPos(61.86291739894551)],[xPos(27.768014059753952), yPos(67.79925795743019)],[xPos(56.59050966608085), yPos(99.51181409880883)],[xPos(0.26362038664323373), yPos(99.35559461042766)],[xPos(0.26362038664323373), yPos(1.0935364186682288)], 'Ed Hartzold grew corn, soybeans, hay, and oats. He hired someone to shell his corn, and then trucked it to the nearby Dry Grove elevator, where it was stored until it was needed. Hartzold hired a thresherman to separate his oats until 1941, when he and a brother-in-law shared the purchase of a small grain combine.']

		  ]
			},
			'1': {
				'barnParams' : [
 				  [[xPos(46.970830216903515), yPos(30.050693925039475)],[xPos(47.04562453253553), yPos(26.99243746364165)],[xPos(51.53328347045625), yPos(29.917726252804787)],[xPos(52.206432311144354), yPos(28.05617884151916)],[xPos(52.655198204936426), yPos(26.59353444693759)],[xPos(53.32834704562453), yPos(25.396825396825395)],[xPos(54.07629020194465), yPos(24.59901936341727)],[xPos(54.89902767389678), yPos(25.26385772459071)],[xPos(56.09573672400897), yPos(27.923211169284468)],[xPos(57.96559461480928), yPos(28.58804953045791)],[xPos(58.1151832460733), yPos(30.582564613978224)],[xPos(51.832460732984295), yPos(33.241918058671985)],[xPos(48.69109947643979), yPos(31.646305991855726)],[xPos(47.793567688855646), yPos(30.44959694174354)],[xPos(47.12041884816754), yPos(30.183661597274163)]],
 				  [[xPos(46.82124158563949), yPos(26.59353444693759)],[xPos(51.53328347045625), yPos(29.651790908335414)],[xPos(52.72999252056844), yPos(26.327599102468213)],[xPos(53.477935676888556), yPos(24.99792238012133)],[xPos(54.15108451757666), yPos(24.46605169118258)],[xPos(54.15108451757666), yPos(24.333084018947893)],[xPos(49.364248317127895), yPos(21.274827557550072)],[xPos(48.317127898279736), yPos(22.471536607662262)],[xPos(47.793567688855646), yPos(23.535277985539764)],[xPos(46.82124158563949), yPos(26.460566774702897)],[xPos(47.793567688855646), yPos(27.258372808111027)],[xPos(50.934928945400145), yPos(29.252887891631346)]]
				  ],

				  'year':'1965',

				  'names' : [
				  	'Picket Fence',
				  	'Loafing Sheds/Barn',
				  	'Livestock Shed',
				  	'Government Surplus Grain Bins',
				  	'Machine Shop',
				  	'Garage',
				  	'Equiptment Storage Shed',
				  	'Silo',
				  	'Silage Cutter/Blower',
				  	'Hay Storage Shed',
				  	'Cob Pile',
				  	'Farrowing Houses',
				  	'Movable Hog Sheds/Feeders',
				  	'Milk House',
				  	'Chicken House'
				  ],

				  'hitParams' : [
				  [xPos(72.21693625118934), yPos(57.84966698382493)],
				  [xPos(52.80685061845861), yPos(28.07907812665187)],
				  [xPos(25.689819219790678), yPos(15.900200866899251)],
				  [xPos(55.18553758325404), yPos(70.02854424357756)],
				  [xPos(63.939105613701244), yPos(48.03890474680198)],
				  [xPos(61.94100856327307), yPos(35.35257426789301)],
				  [xPos(40.15223596574691), yPos(79.162702188392)],
				  [xPos(34.44338725023787), yPos(15.39274764774289)],
				  [xPos(76.97431018078021), yPos(66.81467385558727)],
				  [xPos(36.631779257849665), yPos(22.666243788984037)],
				  [xPos(67.0789724072312), yPos(70.5359974627339)],
				  [xPos(60.9895337773549), yPos(88.29686013320647)],[xPos(50.808753568030454), yPos(19.452373400993764)],[xPos(61.08468125594671), yPos(30.9546463685379)],[xPos(57.18363463368221), yPos(44.31758113965535)]


				  ],
				
				'polyParams' : [
				[[xPos(97.98055347793567), yPos(49.729909415773285)],[xPos(72.5504861630516), yPos(57.3090667331505)],[xPos(67.91323859386686), yPos(54.51674561622205)],[xPos(67.01570680628272), yPos(54.38377794398737)],[xPos(69.3343305908751), yPos(53.45300423834455)],[xPos(71.20418848167539), yPos(51.458489154824235)],[xPos(70.68062827225131), yPos(50.12881243247735)],[xPos(70.0074794315632), yPos(50.92661846588549)],[xPos(68.28721017202693), yPos(51.99035984376299)],[xPos(65.74420344053851), yPos(52.52223053270174)],[xPos(64.84667165295438), yPos(52.12332751599767)],[xPos(64.77187733732237), yPos(53.45300423834455)],[xPos(70.45624532535527), yPos(57.840937422089254)],[xPos(69.4091249065071), yPos(58.106872766558624)],[xPos(69.4091249065071), yPos(59.5695171611402)],[xPos(88.85564697083022), yPos(53.9848749272833)],[xPos(98.27973074046372), yPos(51.325521482589544)], 'The picket fence was constructed by Ed Hartzold’s sons, Joe, Bob, Dick, and Larry.'],	     		  
		  		[[xPos(46.82124158563949), yPos(26.59353444693759)],[xPos(48.24233358264772), yPos(22.870439624366327)],[xPos(49.28945400149588), yPos(21.40779522978476)],[xPos(54.00149588631265), yPos(23.93418100224383)],[xPos(55.57217651458489), yPos(25.529793069060087)],[xPos(56.32011967090501), yPos(27.391340480345715)],[xPos(57.89080029917726), yPos(28.05617884151916)],[xPos(58.1151832460733), yPos(30.050693925039475)],[xPos(52.206432311144354), yPos(33.37488573090667)],[xPos(48.84068810770382), yPos(31.646305991855726)],[xPos(47.793567688855646), yPos(30.44959694174354)],[xPos(47.04562453253553), yPos(30.050693925039475)],[xPos(47.04562453253553), yPos(26.99243746364165)],[xPos(46.74644727000748), yPos(26.59353444693759)], 'Loafing sheds were added to the north and west sides of the barn so that hay could be easily dropped into the sheds from the barn’s loft. Ed Hartzold and his sons fed about 200 heifers (female cattle who have not had calves) per year, along with 25 to 30 steers. When ready, the heifers were bred with Ed’s Angus bull, then sold. The steers also went to market.      With the farm totally mechanized by 1950, the barn no longer housed horses. But Ed and later his son Bob Hartzold still filled the loft with hay for their cattle.'],	
		  		[[xPos(21.54076290201945), yPos(15.158314634754424)],[xPos(23.63500373971578), yPos(12.764896534530044)],[xPos(26.477187733732237), yPos(13.828637912407546)],[xPos(30.516080777860882), yPos(16.620959029335992)],[xPos(30.516080777860882), yPos(18.482506440621624)],[xPos(26.55198204936425), yPos(20.477021524141943)],[xPos(22.36350037397158), yPos(17.817668079448186)],[xPos(21.54076290201945), yPos(15.291282306989112)],[xPos(21.54076290201945), yPos(14.89237929028505)], 'An additional livestock shed was built so Ed could increase the number of livestock he housed.'],
		  		[[xPos(51.30890052356021), yPos(72.6003490401396)],[xPos(52.655198204936426), yPos(73.66409041801711)],[xPos(55.123410620792825), yPos(73.13221972907836)],[xPos(55.94614809274495), yPos(72.46738136790492)],[xPos(58.04038893044129), yPos(72.46738136790492)],[xPos(59.012715033657436), yPos(71.6695753344968)],[xPos(59.23709798055348), yPos(67.68054516745616)],[xPos(57.21765145848915), yPos(65.95196542840523)],[xPos(56.69409124906507), yPos(65.95196542840523)],[xPos(54.45026178010471), yPos(67.41460982298678)],[xPos(53.32834704562453), yPos(67.41460982298678)],[xPos(51.15931189229619), yPos(68.87725421756835)],[xPos(51.15931189229619), yPos(70.73880162885399)],[xPos(51.383694839192216), yPos(72.86628438460899)], 'Ed Hartzold paid a bargain price for these WWII surplus grain bins, which were moved from Stanford and used as farrowing houses for their sows.'],
		  		[[xPos(64.17352281226627), yPos(52.921133549405795)],[xPos(68.13762154076291), yPos(51.325521482589544)],[xPos(68.13762154076291), yPos(49.331006399069224)],[xPos(68.36200448765894), yPos(49.19803872683454)],[xPos(66.2677636499626), yPos(46.538685282140776)],[xPos(62.67763649962603), yPos(44.145267181916395)],[xPos(60.35901271503366), yPos(47.60242666001828)],[xPos(60.35901271503366), yPos(50.92661846588549)],[xPos(63.87434554973822), yPos(52.655198204936426)], 'A new cement block machine shop was constructed as more space was needed for repair and storage of machinery.'],
		  		[[xPos(59.012715033657436), yPos(33.77378874761074)],[xPos(58.86312640239342), yPos(37.89578658688607)],[xPos(60.43380703066566), yPos(39.49139865370232)],[xPos(63.35078534031413), yPos(38.959527964763566)],[xPos(65.37023186237846), yPos(37.62985124241669)],[xPos(65.37023186237846), yPos(33.50785340314136)],[xPos(63.35078534031413), yPos(31.912241336325103)],[xPos(59.61106955871354), yPos(32.975982714202615)],[xPos(59.23709798055348), yPos(33.77378874761074)], 'Formerly used as a machine shop, this building was now a garage for the family car and Bob’s pickup truck.'],
		  		[[xPos(29.768137621540763), yPos(80.04653868528214)],[xPos(42.857142857142854), yPos(73.53112274578243)],[xPos(45.25056095736724), yPos(78.71686196293525)],[xPos(50.26178010471204), yPos(86.42898695254716)],[xPos(48.61630516080778), yPos(90.28504944735312)],[xPos(37.09798055347794), yPos(94.27407961439374)],[xPos(31.488406881077037), yPos(87.89163134712872)],[xPos(29.693343305908755), yPos(82.57292445774121)],[xPos(30.665669409124906), yPos(78.71686196293525)],[xPos(33.1338818249813), yPos(76.98828222388431)], 'By 1957 additional equipment storage was needed, so this shed was built.  That same year Bob purchased a Minneapolis-Moline uni-system picker / sheller for harvesting his corn. Three years later he bought his first combine, an Allis-Chalmer Gleaner, which eliminated the need to hire someone to shell his corn.'],
		  		[[xPos(25.205684367988034), yPos(22.205601263192886)],[xPos(25.579655946148094), yPos(24.333084018947893)],[xPos(26.626776364996264), yPos(24.99792238012133)],[xPos(32.98429319371728), yPos(23.003407296601015)],[xPos(33.58264771877337), yPos(21.274827557550072)],[xPos(35.0037397157816), yPos(19.413280146264437)],[xPos(35.75168287210172), yPos(19.546247818499126)],[xPos(35.67688855646971), yPos(8.908834039724093)],[xPos(35.0037397157816), yPos(6.914318956203773)],[xPos(33.58264771877337), yPos(7.3132219729078365)],[xPos(32.98429319371728), yPos(8.642898695254717)],[xPos(32.38593866866118), yPos(18.482506440621624)],[xPos(31.63799551234106), yPos(18.881409457325688)],[xPos(30.815258040388933), yPos(19.413280146264437)],[xPos(30.516080777860882), yPos(20.344053851907255)],[xPos(25.205684367988034), yPos(21.93966591872351)], 'This cement block silo was added to store the silage Hartzold fed to his growing cattle herd. The feeding system moved the silage into the feeder from the silo, eliminating the need to shovel silage into the feeder. Because the vertical cement silo did not provide enough storage space for the amount of silage needed to feed Hartzold’s cattle, a bunker silo was added to accommodate this need in 1961.'],
		  		[[xPos(73.07404637247569), yPos(66.08493310063992)],[xPos(73.52281226626776), yPos(68.47835120086428)],[xPos(75.99102468212415), yPos(70.73880162885399)],[xPos(78.83320867614061), yPos(70.07396326768055)],[xPos(80.92744951383695), yPos(69.67506025097649)],[xPos(80.92744951383695), yPos(66.74977146181334)],[xPos(79.43156320119671), yPos(63.29261198371145)],[xPos(76.43979057591623), yPos(63.558547328180836)],[xPos(73.67240089753179), yPos(65.1541593949971)],[xPos(73.52281226626776), yPos(66.74977146181334)], 'This equipment used to cut silage (chopped green corn), which was then stored in the vertical or bunker silos.'],
		  		[[xPos(33.43305908750935), yPos(23.93418100224383)],[xPos(33.43305908750935), yPos(20.742956868611316)],[xPos(35.15332834704562), yPos(19.546247818499126)],[xPos(35.97606581899775), yPos(19.94515083520319)],[xPos(40.538519072550486), yPos(22.60450427989695)],[xPos(40.912490650710545), yPos(26.859469791406966)],[xPos(40.23934181002244), yPos(26.859469791406966)],[xPos(39.49139865370232), yPos(25.396825396825395)],[xPos(37.02318623784592), yPos(25.928696085764148)],[xPos(33.58264771877337), yPos(23.80121333000914)],[xPos(33.58264771877337), yPos(22.205601263192886)], 'Hartzold also fed his cattle hay. He added this storage shed because he didn’t have enough space in the barn. Bob maximized his barn storage by purchasing a hay baler about the same time — hay bales, moved into the barn using a portable elevator, could be packed tightly. Owning the baler was also profitable as he typically had 8 to 10 customers who paid him to bale their hay.'],
		  		[[xPos(60.20942408376963), yPos(74.19596110695588)],[xPos(60.35901271503366), yPos(71.13770464555806)],[xPos(65.22064323111444), yPos(66.74977146181334)],[xPos(66.49214659685863), yPos(65.68603008393585)],[xPos(67.16529543754675), yPos(65.1541593949971)],[xPos(77.26252804786836), yPos(72.7333167123743)],[xPos(77.41211667913238), yPos(75.39267015706807)],[xPos(71.20418848167539), yPos(78.31795894623119)],[xPos(63.7247569184742), yPos(77.65312058505775)],[xPos(61.33133881824981), yPos(75.12673481259868)],[xPos(60.658189977561705), yPos(74.06299343472118)], 'After corn shelling, a portable elevator was used to make a cob pile. The corn cobs were used for hog bedding. The Hartzold children often climbed up and down the 20-foot tall pile playing “king of the mountain.”'],
		  		[[xPos(57.06806282722513), yPos(86.42898695254716)],[xPos(57.21765145848915), yPos(84.16853652455747)],[xPos(58.41436050860135), yPos(82.83885980221058)],[xPos(59.38668661181751), yPos(82.83885980221058)],[xPos(62.90201944652206), yPos(85.76414859137373)],[xPos(64.17352281226627), yPos(85.89711626360841)],[xPos(66.7913238593867), yPos(89.22130806947561)],[xPos(66.7913238593867), yPos(91.61472616969999)],[xPos(64.3231114435303), yPos(92.81143521981218)],[xPos(61.18175018698578), yPos(90.55098479182249)],[xPos(59.61106955871354), yPos(89.75317875841436)],[xPos(57.36724008975318), yPos(87.0938253137206)], 'Equipped with eight farrowing stalls, these two-part, dome-shaped buildings were constructed by Ed and Bob Hartzold about 1960. With 60 sows, Bob and his dad farrowed about 1,000 hogs each year.'],
		  		[[xPos(41.760722347629795), yPos(16.252821670428894)],[xPos(41.760722347629795), yPos(13.64434411838475)],[xPos(44.01805869074492), yPos(11.838475043892652)],[xPos(46.50112866817156), yPos(12.239779282668675)],[xPos(53.72460496613996), yPos(18.259342864309005)],[xPos(58.013544018058695), yPos(21.670428893905193)],[xPos(57.78781038374717), yPos(24.078254326561325)],[xPos(55.98194130925508), yPos(25.08151492350138)],[xPos(52.370203160270876), yPos(22.473037371457234)],[xPos(48.645598194130926), yPos(20.065211938801102)],[xPos(46.83972911963883), yPos(19.262603461249057)],[xPos(44.69525959367946), yPos(19.66390770002508)],[xPos(40.9706546275395), yPos(15.65086531226486)],[xPos(41.19638826185101), yPos(13.042387760220716)],[xPos(41.98645598194131), yPos(12.440431402056685)], 'Once the baby pigs were weaned from their mothers, they were taken to the feed lot where they grazed and fed until they reach about 240 pounds, at which time they were taken to market. The hog sheds supplied shade, while the feeders were filled with grain.'],
		  		[[xPos(59.81941309255079), yPos(33.50890393779784)],[xPos(58.91647855530474), yPos(32.90694757963381)],[xPos(58.91647855530474), yPos(31.30173062452972)],[xPos(59.932279909706544), yPos(29.29520943064961)],[xPos(62.528216704288944), yPos(28.291948833709558)],[xPos(63.43115124153499), yPos(29.897165788813645)],[xPos(63.43115124153499), yPos(31.903686982693756)],[xPos(60.60948081264108), yPos(32.90694757963381)], 'By the late 1960s Bob had eliminated milk cows from the farm, except for a couple that were milked for the family. His kids took over the milk house and turned it into a playhouse.'],
		  		[[xPos(50.112866817155755), yPos(43.742162026586406)],[xPos(55.98194130925508), yPos(48.55781289189867)],[xPos(59.480812641083524), yPos(47.35390017557061)],[xPos(61.28668171557562), yPos(46.55129169801856)],[xPos(61.963882618510155), yPos(45.146726862302486)],[xPos(58.013544018058695), yPos(41.334336593930274)],[xPos(56.20767494356659), yPos(40.53172811637823)],[xPos(54.74040632054176), yPos(40.73238023576624)],[xPos(50.45146726862303), yPos(42.136945071482316)],[xPos(50), yPos(43.14020566842237)], 'Chickens were eliminated from the farm around 1965, and the brooder houses were torn down a couple years later. Hartzold converted the chicken houses into calf sheds. An additional calf shed was added around 1968.']
		  ]
			},
			'2': {
				'barnParams' : [
					[[xPos(53.09229305423406), yPos(41.2728618247172)],[xPos(53.09229305423406), yPos(44.31758113965535)],[xPos(56.99333967649858), yPos(49.561264404271064)],[xPos(61.94100856327307), yPos(48.88466011206258)],[xPos(68.88677450047574), yPos(48.88466011206258)],[xPos(68.88677450047574), yPos(47.19314938154139)],[xPos(69.45765937202664), yPos(46.17824294322867)],[xPos(69.45765937202664), yPos(45.670789724072314)],[xPos(64.60513796384396), yPos(43.47182577439476)],[xPos(62.89248334919124), yPos(41.103710751665076)],[xPos(61.5604186489058), yPos(40.08880431335236)],[xPos(61.17982873453853), yPos(39.91965324030025)],[xPos(59.84776403425309), yPos(40.4271064594566)],[xPos(58.705994291151285), yPos(41.94946611692568)],[xPos(57.0884871550904), yPos(44.82503435881171)],[xPos(56.89819219790676), yPos(44.99418543186383)],[xPos(52.99714557564224), yPos(41.2728618247172)],[xPos(53.09229305423406), yPos(44.31758113965535)]],
					[[xPos(52.71170313986679), yPos(40.59625753250872)],[xPos(56.80304471931494), yPos(44.65588328575959)],[xPos(57.84966698382493), yPos(43.810127920499)],[xPos(58.801141769743104), yPos(41.611163970821444)],[xPos(59.84776403425309), yPos(40.4271064594566)],[xPos(61.46527117031398), yPos(39.581351094196)],[xPos(62.511893434823975), yPos(40.76540860556084)],[xPos(63.27307326355851), yPos(41.611163970821444)],[xPos(64.2245480494767), yPos(43.30267470134264)],[xPos(64.70028544243578), yPos(43.64097684744688)],[xPos(69.74310180780209), yPos(45.163336504915954)],[xPos(65.84205518553759), yPos(41.2728618247172)],[xPos(63.08277830637488), yPos(39.24304894809176)],[xPos(61.27497621313035), yPos(38.90474680198753)],[xPos(58.61084681255947), yPos(36.70578285230997)],[xPos(56.99333967649858), yPos(35.18342319484089)],[xPos(55.18553758325404), yPos(36.53663177925785)],[xPos(54.709800190294956), yPos(37.044084998414206)],[xPos(53.663177925784964), yPos(38.90474680198753)],[xPos(52.80685061845861), yPos(40.4271064594566)],[xPos(56.32730732635585), yPos(44.14843006660323)]]
				],

				'year':'1975',

				'names' : [
					'Barn',
				  	'Silos',
				  	'Calf Sheds',
				  	'Hog Houses',
				  	'Hay Baler',
				  	'Corn Crib',
				  	'Machine Shed',
				  	'Grain Bins/Dryer'
				  ],

				 'hitParams' : [
				 	[xPos(60.13320647002855), yPos(41.44201289776932)],[xPos(41.96003805899144), yPos(24.865207738661592)],[xPos(54.80494766888677), yPos(61.57099059097156)],[xPos(69.17221693625119), yPos(31.631250660746378)],[xPos(58.896289248334924), yPos(53.2825880114177)],[xPos(46.90770694576594), yPos(49.899566550375305)],[xPos(23.882017126546145), yPos(63.769954540649124)],[xPos(23.215984776403424), yPos(48.20805581985411)]


				 ], 
				
				'polyParams' : [
	     		  [[xPos(52.99714557564224), yPos(44.82503435881171)],[xPos(56.89819219790676), yPos(49.392113331218944)],[xPos(68.88677450047574), yPos(47.53145152764563)],[xPos(69.55280685061845), yPos(46.00909187017655)],[xPos(69.55280685061845), yPos(45.501638651020194)],[xPos(70.02854424357756), yPos(45.332487577968074)],[xPos(65.55661274976214), yPos(40.25795538640448)],[xPos(61.17982873453853), yPos(38.39729358283117)],[xPos(56.89819219790676), yPos(34.84512104873666)],[xPos(54.99524262607041), yPos(36.029178560101485)],[xPos(52.80685061845861), yPos(40.4271064594566)],[xPos(52.80685061845861), yPos(44.65588328575959)],[xPos(55.18553758325404), yPos(47.19314938154139)], 'By 1975 Bob had dramatically reduced the cattle on his farm and had expanded his hog operation. The barn was modified to accommodate farrowing hogs.'],
	     		  [[xPos(43.86298763082778), yPos(31.462099587694258)],[xPos(43.67269267364415), yPos(19.283222327941644)],[xPos(42.8163653663178), yPos(17.42256052436833)],[xPos(42.055185537583256), yPos(16.91510730521197)],[xPos(41.008563273073264), yPos(16.91510730521197)],[xPos(39.77164605137964), yPos(18.437466962681047)],[xPos(39.96194100856327), yPos(19.790675547098)],[xPos(40.05708848715509), yPos(27.06417168833915)],[xPos(38.91531874405329), yPos(28.07907812665187)],[xPos(38.72502378686965), yPos(31.123797441590018)],[xPos(40.34253092293054), yPos(32.477006026006976)],[xPos(41.864890580399624), yPos(31.123797441590018)],[xPos(43.57754519505233), yPos(31.462099587694258)], 'Because Bob had fewer cattle, he no longer filled his vertical and bunker silos with silage.'],
	     		  [[xPos(51.28449096098954), yPos(54.974098741938896)],[xPos(48.81065651760228), yPos(58.357120202981285)],[xPos(49.57183634633682), yPos(62.416745956232155)],[xPos(51.66508087535681), yPos(65.29231419811819)],[xPos(54.51950523311132), yPos(65.63061634422243)],[xPos(56.6127497621313), yPos(65.12316312506607)],[xPos(57.75451950523311), yPos(63.262501321492756)],[xPos(56.89819219790676), yPos(59.202875568241886)],[xPos(54.80494766888677), yPos(55.98900518025162)],[xPos(53.09229305423406), yPos(54.46664552278253)],[xPos(50.523311132255), yPos(55.65070303414738)], 'No longer raising calves, Bob tore down the converted chicken houses.'],
	     		  [[xPos(62.60704091341579), yPos(26.556718469182787)],[xPos(67.64985727878211), yPos(26.049265250026433)],[xPos(72.88296860133207), yPos(30.44719314938154)],[xPos(76.4034253092293), yPos(34.84512104873666)],[xPos(72.97811607992388), yPos(38.39729358283117)],[xPos(70.40913415794482), yPos(37.38238714451845)],[xPos(65.74690770694576), yPos(33.4919124643197)],[xPos(63.558515699333974), yPos(30.27804207632942)],[xPos(62.98763082778306), yPos(26.72586954223491)],[xPos(62.98763082778306), yPos(25.71096310392219)], 'Portable A-frame hog houses, used for farrowing and finishing hogs, were constructed in the 1970s as the Hartzolds’ hog business increased. Bob’s sons, Joe and Rod, helped with both the crops and livestock.'],
	     		  [[xPos(55.85156993339676), yPos(50.57617084258378)],[xPos(56.70789724072313), yPos(50.57617084258378)],[xPos(59.94291151284491), yPos(51.42192620784438)],[xPos(60.22835394862036), yPos(52.60598371920921)],[xPos(59.27687916270219), yPos(55.8198541071995)],[xPos(56.99333967649858), yPos(56.49645839940797)],[xPos(55.47098001902949), yPos(55.481551961095256)],[xPos(55.18553758325404), yPos(53.2825880114177)],[xPos(55.56612749762131), yPos(51.92937942700075)], 'Bob purchased a new baler that made large rounds bales. He used it for baling straw, which he used for hog bedding.'],
	     		  [[xPos(43.9581351094196), yPos(50.57617084258378)],[xPos(44.14843006660323), yPos(51.5910772808965)],[xPos(45.38534728829686), yPos(52.77513479226133)],[xPos(47.19314938154139), yPos(52.60598371920921)],[xPos(47.95432921027592), yPos(50.91447298868802)],[xPos(47.95432921027592), yPos(49.222962258166824)],[xPos(46.52711703139867), yPos(48.03890474680198)],[xPos(45.19505233111323), yPos(48.03890474680198)],[xPos(44.05328258801141), yPos(49.392113331218944)], 'Because Bob combined his corn and no longer needed to store ear corn, the corn crib was torn down in 1973.'],
	     		  [[xPos(12.274024738344433), yPos(58.526271276033405)],[xPos(12.274024738344433), yPos(62.755048102336396)],[xPos(18.83920076117983), yPos(78.48609789618352)],[xPos(33.68220742150333), yPos(76.4562850195581)],[xPos(33.77735490009515), yPos(70.36684638968178)],[xPos(26.831588962892482), yPos(56.83476054551221)],[xPos(19.50523311132255), yPos(55.143249814991016)],[xPos(15.318744053282588), yPos(57.00391161856433)],[xPos(12.654614652711704), yPos(58.18796912992917)],[xPos(12.178877259752618), yPos(58.526271276033405)],[xPos(12.178877259752618), yPos(61.57099059097156)], 'A new machine shed was constructed for storing larger equipment. Bob chose this particular brand because it was taller and accommodated larger machinery. He paid $14,000 for the building.'],
				  [[xPos(24.45290199809705), yPos(55.8198541071995)],[xPos(26.450999048525215), yPos(56.15815625330374)],[xPos(27.97335870599429), yPos(59.033724495189766)],[xPos(30.542340627973356), yPos(58.864573422137646)],[xPos(30.44719314938154), yPos(49.561264404271064)],[xPos(23.882017126546145), yPos(40.59625753250872)],[xPos(21.788772597526165), yPos(38.39729358283117)],[xPos(19.410085632730734), yPos(42.79522148218628)],[xPos(18.458610846812558), yPos(49.053811185114704)],[xPos(18.458610846812558), yPos(53.79004123057406)],[xPos(19.410085632730734), yPos(54.80494766888677)],[xPos(26.64129400570885), yPos(56.49645839940797)],[xPos(27.59276879162702), yPos(58.695422349085526)], 'Bob added on-farm grain storage bins, and a grain dryer. By this date, most of the 780 acres (240 owned, 540 rented) he farmed were more profitable corn and soybeans. On-farm storage and drying meant money savings as well as potentially better profits, without the fee to have the grains stored at the elevator.']
				  ]
			},
			'3': {
				'barnParams' : [
					[[xPos(42.6131511528608), yPos(21.406205522345573)],[xPos(42.69854824935952), yPos(22.924376126767246)],[xPos(44.57728437233134), yPos(24.746180852073252)],[xPos(48.249359521776256), yPos(23.68346142897808)],[xPos(48.249359521776256), yPos(23.22801024765158)],[xPos(48.249359521776256), yPos(22.62074200588291)],[xPos(46.883005977796756), yPos(21.861656703672075)],[xPos(46.45602049530316), yPos(20.798937280576904)],[xPos(46.199829205807), yPos(20.343486099250406)],[xPos(45.77284372331341), yPos(20.191669038808236)],[xPos(45.345858240819815), yPos(20.647120220134738)],[xPos(45.00426985482493), yPos(21.558022582787743)],[xPos(44.662681468830066), yPos(22.468924945440744)],[xPos(42.78394534585824), yPos(21.10257140146124)],[xPos(42.69854824935952), yPos(22.468924945440744)]],
					[[xPos(42.6131511528608), yPos(21.406205522345573)],[xPos(44.57728437233134), yPos(22.77255906632508)],[xPos(45.08966695132365), yPos(20.950754341019074)],[xPos(45.51665243381725), yPos(20.343486099250406)],[xPos(45.94363791631085), yPos(20.191669038808236)],[xPos(46.54141759180188), yPos(20.950754341019074)],[xPos(46.96840307429547), yPos(22.01347376411424)],[xPos(48.4201537147737), yPos(22.468924945440744)],[xPos(47.65157984628522), yPos(21.70983964322991)],[xPos(46.79760888129804), yPos(21.10257140146124)],[xPos(46.37062339880444), yPos(20.495303159692572)],[xPos(45.858240819812124), yPos(20.03985197836607)],[xPos(43.72331340734415), yPos(18.36986431350223)],[xPos(43.29632792485055), yPos(19.128949615713065)],[xPos(42.86934244235696), yPos(20.03985197836607)],[xPos(42.6131511528608), yPos(20.798937280576904)],[xPos(43.210930828351835), yPos(21.406205522345573)],[xPos(44.15029888983775), yPos(22.16529082455641)]]
				],

				'year':'2015',

				'names' : [
					'Farmland',
					'Farm House',
					'Machine Shed',
					'Grain Bins',
					'Clearing the Site',
					'Machine Shed'
					
					
					
					
				  	
				  	
				  ],

				 'hitParams' : [

				 [xPos(18.48802395209581), yPos(39.12175648702595)],
				 [xPos(66.84131736526946), yPos(18.496340652029275)],
				 [xPos(23.877245508982035), yPos(7.18562874251497)],
				 [xPos(76.57185628742515), yPos(56.68662674650699)],
				 [xPos(43.038922155688624), yPos(10.512308715901531)],
				 [xPos(16.092814371257486), yPos(12.77445109780439)]
				 ], 
				
				'polyParams' : [
				[[xPos(46.558105107327904), yPos(0.3947693066864051)],[xPos(44.41154700222057), yPos(2.763385146804836)],[xPos(39.97039230199852), yPos(3.0265646845957725)],[xPos(37.00962250185048), yPos(3.9476930668640513)],[xPos(33.530717986676535), yPos(4.737231680236861)],[xPos(30.12583271650629), yPos(5.921539600296077)],[xPos(28.275351591413767), yPos(5.526770293609672)],[xPos(26.42487046632124), yPos(3.2897442223867097)],[xPos(21.317542561065878), yPos(3.9476930668640513)],[xPos(18.800888230940043), yPos(4.737231680236861)],[xPos(19.467061435973353), yPos(8.684924747100913)],[xPos(14.803849000740193), yPos(8.290155440414509)],[xPos(10.140636565507032), yPos(11.053540587219343)],[xPos(10.288675055514434), yPos(14.73805411629246)],[xPos(11.398963730569948), yPos(23.028209556706965)],[xPos(12.509252405625462), yPos(26.317953779093678)],[xPos(20.207253886010363), yPos(24.080927707870714)],[xPos(27.091043671354555), yPos(22.370260712229626)],[xPos(31.236121391561806), yPos(30.397236614853195)],[xPos(34.41894892672095), yPos(38.555802286372234)],[xPos(34.64100666173205), yPos(45.924829344518464)],[xPos(30.6439674315322), yPos(52.76749732708282)],[xPos(23.316062176165804), yPos(57.63631877621515)],[xPos(17.024426350851222), yPos(61.05765276749733)],[xPos(7.772020725388601), yPos(67.63714121227075)],[xPos(0.22205773501110287), yPos(72.24278312361214)],[xPos(0.22205773501110287), yPos(0.5263590755818736)], 'In 2016 a new 80 by 200 foot storage shed was constructed in order to provide storage for his large, modern equipment, such as sprayers, planters, cultivators, combines, and tractors.'],
				[[xPos(63.952627683197626), yPos(19.47528579652932)],[xPos(65.95114729829756), yPos(18.42256764536557)],[xPos(65.80310880829016), yPos(17.238259725306357)],[xPos(69.2079940784604), yPos(15.659182498560737)],[xPos(70.02220577350111), yPos(17.501439263097293)],[xPos(70.31828275351592), yPos(21.317542561065878)],[xPos(68.5418208734271), yPos(22.76503001891603)],[xPos(66.76535899333827), yPos(24.34410724566165)],[xPos(64.84085862324204), yPos(23.2913890944979)],[xPos(64.10066617320503), yPos(22.238670943334153)],[xPos(64.17468541820874), yPos(19.343696027633854)], 'In 2016 major changes happened on the Hartzold Farm. Joe took down all the buildings and equipment that no longer served any purpose. A loafing shed, silo, auger feeder, hay shed, bunker silo, six small grain bins, an old grain dryer, and a small machine shed were all torn down.'],
				[[xPos(18.800888230940043), yPos(4.86882144913233)],[xPos(22.723908216136195), yPos(3.816103297968583)],[xPos(26.42487046632124), yPos(3.2897442223867097)],[xPos(28.127313101406365), yPos(5.3951805247142035)],[xPos(28.34937083641747), yPos(8.553334978205445)],[xPos(20.651369356032568), yPos(10.921950818323875)],[xPos(19.31902294596595), yPos(8.02697590262357)],[xPos(18.874907475943743), yPos(5.132000986923266)], 'In 2000 Joe added additional grain storage. One of the three bins was built specifically to hold wet grain. A new grain dryer was also added. The last and largest grain bin and a new dryer system were added in 2007. The group of bins provided Joe with enough space to store 212,000 bushels of grain. Until 2013 grain was moved from the unloading hopper to the dryer and then into storage using augers. Starting in 2013 Joe began to replace the augers used to move the grain with “legs” like those used in large grain elevators. Each of these “legs” used a system of buckets on a conveyor belt that passed through the hopper to pick up the grain and raise it to the top of the system. From there gravity was used to move it into the desired bin.'],
				[[xPos(57.364914877868245), yPos(54.60975409161938)],[xPos(58.77128053293856), yPos(51.846368944814536)],[xPos(62.54626202812731), yPos(50.79365079365079)],[xPos(65.28497409326425), yPos(50.92524056254626)],[xPos(66.02516654330127), yPos(47.76708610905502)],[xPos(68.319763138416), yPos(46.31959865120487)],[xPos(70.31828275351592), yPos(41.45077720207254)],[xPos(79.05255366395264), yPos(33.42380129944897)],[xPos(81.34715025906736), yPos(26.449543547989148)],[xPos(81.56920799407847), yPos(16.05395180524714)],[xPos(86.15840118430792), yPos(12.23784850727856)],[xPos(90.22945965951146), yPos(18.42256764536557)],[xPos(90.37749814951887), yPos(23.949337938975248)],[xPos(88.89711324944486), yPos(29.212928694793977)],[xPos(88.23094004441154), yPos(31.318364997121474)],[xPos(91.48778682457439), yPos(30.7920059215396)],[xPos(95.04071058475203), yPos(34.47651945061271)],[xPos(98.37157660991858), yPos(37.89785344189489)],[xPos(97.48334566987417), yPos(46.05641911341393)],[xPos(96.96521095484826), yPos(53.293856402664694)],[xPos(96.96521095484826), yPos(58.03108808290155)],[xPos(92.5980754996299), yPos(60.79447322970639)],[xPos(91.11769059955589), yPos(67.76873098116621)],[xPos(88.82309400444115), yPos(70.2689365901801)],[xPos(83.7897853441895), yPos(70.00575705238917)],[xPos(82.67949666913398), yPos(76.980014803849)],[xPos(77.720207253886), yPos(80.40134879513118)],[xPos(75.64766839378238), yPos(79.61181018175837)],[xPos(73.57512953367875), yPos(86.71765770211366)],[xPos(68.6158401184308), yPos(87.50719631548647)],[xPos(64.91487786824575), yPos(83.55950324862242)],[xPos(63.06439674315322), yPos(77.37478411053542)],[xPos(56.40266469282014), yPos(68.03191051895715)],[xPos(56.77276091783864), yPos(61.847191380870136)],[xPos(57.88304959289415), yPos(52.24113825150094)],[xPos(60.91783863804589), yPos(51.05683033144173)],[xPos(63.87860843819393), yPos(49.60934287359158)],[xPos(66.61732050333087), yPos(46.31959865120487)],[xPos(68.76387860843819), yPos(45.13529073114565)],[xPos(69.8741672834937), yPos(41.84554650875894)], 'Joe added a new 90 by 90 foot equipment shed which was needed to store additional equipment.  When Joe took over the Hartzold farm, he added more rented acreage, farming between 1,200 and 1,800 acres total. More acreage required bigger equipment and more storage. The shed included office space, storage for repair parts, a bathroom, and a kitchen, as well as sleeping quarters above. Joe, his wife, and their two daughters lived in an old farmhouse on one of the farms he rented, but he wanted to be prepared for any situation.'],
				[[xPos(36.19541080680977), yPos(5.526770293609672)],[xPos(38.04589193190229), yPos(4.2108726046549885)],[xPos(41.00666173205033), yPos(5.263590755818735)],[xPos(45.44781643227239), yPos(4.2108726046549885)],[xPos(47.44633604737232), yPos(3.684513529073115)],[xPos(54.99629903774982), yPos(10.264001973846533)],[xPos(54.330125832716504), yPos(14.080105271815116)],[xPos(50.92524056254626), yPos(17.764618800888233)],[xPos(46.039970392301996), yPos(21.580722098856814)],[xPos(34.27091043671355), yPos(15.132823422978865)],[xPos(32.12435233160622), yPos(11.053540587219343)],[xPos(31.236121391561806), yPos(7.23743728925076)],[xPos(33.82679496669134), yPos(5.658360062505141)], 'Though Bob no longer ran the farm, he and his wife Marian still lived there. In 1991 they built a new home, and tore down the original house, which at the time was estimated to be 130 years old.'],
				[[xPos(12.583271650629163), yPos(26.581133316884614)],[xPos(11.769059955588453), yPos(22.76503001891603)],[xPos(11.324944485566247), yPos(22.76503001891603)],[xPos(9.622501850481125), yPos(11.579899662801218)],[xPos(14.507772020725387), yPos(8.421745209309977)],[xPos(19.76313841598816), yPos(8.94810428489185)],[xPos(24.57438934122872), yPos(18.685747183156508)],[xPos(24.72242783123612), yPos(23.028209556706965)],[xPos(13.027387120651369), yPos(26.97590262357102)], 'In 1982 Bob and his oldest son Joe, who farmed with him, decided to get out of the livestock business. They sold all of their livestock equipment, including the portable A-frame hog houses and feeders. After that, the only crops they grew were corn and soybeans.']
				]
			}
			};

		  // polyParams = [[[xPos(0),yPos(0)], [xPos(26),yPos(0)], [xPos(52),yPos(21)], [xPos(36.7),yPos(28.9)]]];

		  polyParams = coords[currentScreen]['polyParams'];

		  barnParams = coords[currentScreen]['barnParams'];

		  hitParams = coords[currentScreen]['hitParams'];

		  names = coords[currentScreen]['names'];

		  year = coords[currentScreen]['year'];

		  polyParams.forEach(function(item, index){
		  	silhouettes.push(p.loadImage("images/silhouette_0"+(screenSelected+1)+"/"+(index+1)+".png"));
		  });
		  

		  for(var i=0; i<polyParams.length; i++){
		  	hitTracker[i] = false;
		  	polyParams[i].forEach(function(item, index){
		  		if(isArray(item)){
		  			if(poly[i] == undefined){poly[i] = [];}
		  			poly[i].push(p.createVector(polyParams[i][index][0],polyParams[i][index][1]));
		  		}
		  	});
		 }

		 $rootScope.totalItems = poly.length;
		 $rootScope.itemCount = 0;
		 $rootScope.$apply();

		  

		 for(var i=0; i<barnParams.length; i++){
		  	barnParams[i].forEach(function(item, index){
		  		if(barn[i] == undefined){barn[i] = [];}
		  		barn[i].push(p.createVector(barnParams[i][index][0],barnParams[i][index][1]));
		  	});
		 }

		}

		
		
		var selectedItemText;
		p.draw = function() {
			p.background(bg);
			// p.background(gradient);
			p.textFont(myFont);

			// if(itemsFound.length === 0){
			// 	p.text(year, 20, 35);
			// }else{
				
			// }
			p.textSize(20);
			if(itemsFound.length){
				p.background(overlay);	
			}
			
			if(nextClicked){
				modalScope.show = true;
			    $rootScope.textDisplay = 1;
			    modalScope.$apply();
			    $rootScope.$apply();
			    itemsFound = [];
			    selectedItemText = '';
				nextClicked = false;
			}

			 
			 p.noStroke();
			 p.fill(255,255,255,0);
			  for(i=0; i < poly.length; i++){
			  	p.beginShape();
			  	for(j=0; j < poly[i].length; j++){
			    	p.vertex(poly[i][j].x,poly[i][j].y);
				}
				p.endShape(p.CLOSE);
				hitTracker[i] = p.collidePointPoly(p.mouseX,p.mouseY,poly[i]);
			  }
		   	  



		   	  

			   p.fill(255);

			   if($rootScope.minimizeScreen){
			   		minimizeScreen();
			   		$rootScope.minimizeScreen = !$rootScope.minimizeScreen;
			   }


			   if($rootScope.switchScreen){
			   		switchScreen(1965, 2);
			   		$rootScope.switchScreen = !$rootScope.switchScreen;
			   		$rootScope.compareCounter = 0;
			   }

			   if($rootScope.switchLastScreen){
			   		switchScreen(1975, 3);
			   		$rootScope.switchLastScreen = !$rootScope.switchLastScreen;
			   		$rootScope.compareCounter = 0;
			   }

			   if($rootScope.goHome){
			   		goHome();
			   		$rootScope.itemCount = -1;
			   		$rootScope.goHome = !$rootScope.goHome;
			   }


			   itemsFound.forEach(function(item, index){
			   		if(index !== itemsFound.length -1){
			   			p.background(silhouettes[item]);
			   		}else{
				   		p.fill(255, 255, 255, 170);
				   		p.stroke(255,90,95);
				   		p.strokeWeight(2);
				   		// p.ellipse(hitParams[item][0], hitParams[item][1], 20, 20);
				   		p.textAlign(p.CENTER);
				   		p.noStroke();
				   		p.fill(0,0,0,120);
				   		p.text(names[item], hitParams[item][0] + 1, hitParams[item][1] + 1);
				   		p.text(names[item], hitParams[item][0] + 1, hitParams[item][1]);
				   		p.text(names[item], hitParams[item][0], hitParams[item][1] + 1);
				   		p.text(names[item], hitParams[item][0] - 1, hitParams[item][1] - 1);
				   		p.fill(255);
				   		p.text(names[item], hitParams[item][0], hitParams[item][1]);
			   		}
			   		
			   })

			   p.textSize(30);
			   p.stroke(0);
			   p.text(year, 50, 35);

			   if(selectedItemText && checkHits()){
		   	  	 var width = 200;
		   	  	 p.noStroke();
		   	  	 p.fill(255, 255, 255, 200);
		   	  	 var textHeightMapped = p.map(textBoxHeight, 0, 150, 0, 550);

		   	  	 textHeightMapped = (textHeightMapped < 125) ? 125 : textHeightMapped;

		   	  	 var rectYPos = (p.mouseY - (width / 2)) > 0 ? (p.mouseY - (width / 2)) : 0;

		   	  	 rectYPos = (rectYPos + textHeightMapped) > p.height ? rectYPos - ((rectYPos + textHeightMapped) - p.height) : rectYPos;
			   }else{
			   	selectedItemText = null;
			   }

			if(screenSelected === 0){
		  		runDemo(p.frameCount);
		  	}
			 
			   			

			   
		}


		function checkHits(){
			var hit = false
			$.each(hitTracker, function(k, v) {
				if(v == true){
					hit = true;
				}
			});
			return hit;

		}

		function minimizeScreen(){
			$('#sketch-holder').hide();
			$('body').css({'background':'url("images/gradient.jpg") no-repeat center center fixed'});
			$('#counter').css({'color':'black', 'left':'22%'});
			reSetup(1.5, 1);
			myElement.show();
			myElement.css({ 'background-image': "url('images/farm_01_complete.jpg')" });
			bg = p.loadImage("images/farm_02.jpg");	
			setTimeout(function(){
    			myElement.css({'position':'absolute',
  					   'width': $(window).width() / 3,
  					   	'height': (($(window).width() / 16) * 9) / 3,
  					   	'top':'5%',
  					   	 'left': ((5 / 16) * 9) + '%',
  					   	 'margin': '0'});
    			// myElement.append( "<p class='small-date'>1940</p>" );
    			
    		}, 10);


				$('#defaultCanvas0').hide();
    			$('#sketch-holder').show();
    			
    			$('#defaultCanvas0').fadeIn(500);
 
    			canvas = p.createCanvas($(window).width() / 1.5, (($(window).width() / 16) * 9) / 1.5) ;
    			$('#defaultCanvas0').css({'position':'absolute',
    				'top':'25%',
    				'right': '2.5%'
    				});

		}



		function switchScreen(year, obj){
			reSetup(1.5, obj);
			$('.tile').fadeOut(200);

				if(year == 1965){
					myElement1.show();
					myElement1.css({ 'background-image': "url('images/farm_02_complete.jpg')" });
					myElement1.css({'position':'absolute',
							   'width': $(window).width() / 1.5,
							   	'height': (($(window).width() / 16) * 9) / 1.5,
							   	'top':'25%',
							   	'right': '2.5%',
							   	'margin': '0'});

					setTimeout(function(){
		    			myElement1.css({'position':'absolute',
		  					   'width': $(window).width() / 3,
		  					   	'height': (($(window).width() / 16) * 9) / 3,
		  					   	'top':'5%',
		  					   	 'left': ((5 / 16) * 9) + '%',
		  					   	 'margin': '0'});
				// myElement1.append( "<p class='small-date'>1965</p>" );
		    			
		    		}, 10);
		    			
					bg = p.loadImage("images/farm_03.jpg");
			}else{

				myElement2.show();
				myElement2.css({ 'background-image': "url('images/farm_03_complete.jpg')" });
					myElement2.css({'position':'absolute',
							   'width': $(window).width() / 1.5,
							   	'height': (($(window).width() / 16) * 9) / 1.5,
							   	'top':'25%',
							   	'right': '2.5%',
							   	'margin': '0'});

					setTimeout(function(){
		    			myElement2.css({'position':'absolute',
		  					   'width': $(window).width() / 3,
		  					   	'height': (($(window).width() / 16) * 9) / 3,
		  					   	'top':'5%',
		  					   	 'left': ((5 / 16) * 9) + '%',
		  					   	 'margin': '0'});
		    				// myElement2.append( "<p class='small-date'>1975</p>" );
		    			
		    		}, 10);
		    			
					bg = p.loadImage("images/farm_04.jpg");


			}

		}

		function goHome(){
			$state.go('home');
			$state.reload();
		}


		var log =[];
		p.mousePressed = function(e){
			if(demoIsRunning){
				e.preventDefault();
				return true;
			}

			// modalScope.modalShown = modalScope.modalShown;
			var xPos = function(input){
		  	  return p.map(input, 0, p.windowWidth, 0, 100);
			}
			var yPos = function(input){
			  return p.map(input,  0, (p.windowWidth / 16) * 9, 0, 100);	
			 }
			log.push('[xPos('+xPos(p.mouseX)+'), yPos('+yPos(p.mouseY)+')]')


			poly.forEach(function(item, index){
				if(hitTracker[index]){
					if(itemsFound.indexOf(index) === -1){
						itemsFound.push(index);
						$rootScope.itemCount = itemsFound.length;
						$rootScope.$apply();
					}



					overlay = p.loadImage("images/overlays_0"+(screenSelected+1)+"/"+(index+1)+".png");
					selectedItemText = polyParams[index][polyParams[index].length - 1];
					$rootScope.selectedText = selectedItemText;
					$rootScope.selectedTextTitle = names[index];
					$rootScope.$apply();
					words = selectedItemText.split(" ");
 
 					textBoxHeight = words.length;

 					if(itemsFound.length == poly.length){
						setTimeout(function(){
						  $rootScope.firstSlide = false;	
					      modalScope.show = true;
						  $rootScope.textDisplay++;
						  modalScope.$apply();
						  $rootScope.selectedText = false;
						  $rootScope.$apply();
						  itemsFound = [];
						}, 10000);
						
					}
				}
			});
		}

		var demoIndex = 0;
		var demoArray = [];
		var endTriggered = false;
		runDemo = function(frameCount){	
			$rootScope.firstSlide = true;
			if(demoIndex < polyParams.length){
			if(frameCount % (60 * 10) === 0){
				demoArray.push(demoIndex);
				demoArray.forEach(function(i, index){
					hitTracker[index] = true;
				});
				itemsFound.push(demoIndex);
				$rootScope.itemCount = itemsFound.length;
				overlay = p.loadImage("images/overlays_0"+(screenSelected+1)+"/"+(demoIndex+1)+".png");
				// overlay = p.loadImage("images/silhouette_0"+(screenSelected+1)+"/"+(demoIndex+1)+".png");
				selectedItemText = polyParams[demoIndex][polyParams[demoIndex].length - 1];
				$rootScope.selectedText = selectedItemText;
				$rootScope.selectedTextTitle = names[demoIndex];
				$rootScope.$apply();
				demoIndex ++;
				}
				
			}else{
				if(!endTriggered){	
					setTimeout(function(){
						modalScope.show = true;
						$rootScope.textDisplay = 1;
						modalScope.$apply();
						$rootScope.$apply();
						selectedItemText = '';
						itemsFound = [];
					}, 3000);	
				endTriggered = true;
			}
		}
			

		}

		p.keyPressed = function(e){
			console.log(log.toString());
			if(e.key == '2'){
			  modalScope.show = true;
			  $rootScope.textDisplay = 1;
			  modalScope.$apply();
			  $rootScope.selectedText = false;
			  $rootScope.$apply();
			  selectedItemText = '';
			  itemsFound = [];
			}
			if(e.key == '3'){
			  modalScope.show = true;
			  $rootScope.textDisplay = 2;
			  modalScope.$apply();
			  $rootScope.selectedText = false;
			  $rootScope.$apply();
			  selectedItemText = '';
			  itemsFound = [];
			}
			if(e.key == '4'){
			  modalScope.show = true;
			  $rootScope.textDisplay = 3;
			  modalScope.$apply();
			  $rootScope.selectedText = false;
			  $rootScope.$apply();
			  selectedItemText = '';
			  itemsFound = [];
			}
			if(e.key == '5'){
			  modalScope.show = true;
			  $rootScope.textDisplay = 4;
			  modalScope.$apply();
			  $rootScope.selectedText = false;
			  $rootScope.$apply();
			  selectedItemText = '';
			  itemsFound = [];
			}
			
		}

		p.mouseMoved = function(e){
			if(demoIsRunning){
				e.preventDefault();
				return true;
			}
			var xPos = function(input){
		  	return p.map(input, 0, p.windowWidth, 0, 100);
			  }
			 var yPos = function(input){
			  	return p.map(input,  0, (p.windowWidth / 16) * 9, 0, 100);	
			  }
			  $.each(hitTracker, function(k, v) {
				if(v == true){
					hitTracker[k]= false;
				}
			});
		}


		function isArray(obj){
		    return !!obj && Array === obj.constructor;
		}




	};
	var myp5 = new p5(b);



};
	

