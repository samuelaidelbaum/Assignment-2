angular
  .module('app', ['ngRoute', 'firebase'])
  // You need to fill in your own config properties from the firebase console
  .constant('firebaseConfig', {
   apiKey: "AIzaSyDTDc8aNechfoRGyWNuYUdOdym0XgJ8ZPc",
    authDomain: "week10-4cf4c.firebaseapp.com",
    databaseURL: "https://week10-4cf4c.firebaseio.com",
    storageBucket: "week10-4cf4c.appspot.com",
    messagingSenderId: "339028498878",
  })
    .run(firebaseConfig => firebase.initializeApp(firebaseConfig))
  .service('dbRefRoot', DbRefRoot)
  .service('movies', Movies)
  .factory('movieFactory', MovieFactory)
  .factory('movieListFactory', MovieListFactory)
  .controller('MovieCtrl', MovieCtrl)
 .config(function($routeProvider, $locationProvider) {
    

                
    $routeProvider
  
      .when('/details/:itemID', {
        templateUrl: 'views/details2.html',
        controller: 'MovieCtrl'
      })
   
      .otherwise( {redirectTo: '/'} )



  })

function MovieFactory($firebaseObject, $firebaseUtils) {
    return $firebaseObject.$extend({
        $$updated: function (snap) {
  const changed = $firebaseObject.prototype.$$updated.apply(this, arguments);
    if (changed) {
        this.ReleaseDate = this.ReleaseDate ? new Date(this.ReleaseDate) : null
      }
     return changed
    },
        toJSON: function() {
            
            return $firebaseUtils.toJSON(angular.extend({}, this, {ReleaseDate: this.ReleaseDate ? this.ReleaseDate.getTime() : null
                                                                }))
        },
         $$defaults: {
      title: '',
      description: '',
      cast: '',
     director: '',
      ReleaseDate: new Date(),
     
    }
        
    })
}

function MovieListFactory($firebaseArray, movieFactory) {
    return $firebaseArray.$extend({
        
        $$added: function(snap) {
            return movieFactory(snap.ref)
        }
    })
}
function DbRefRoot() {
    return firebase.database().ref()
}
function Movies(dbRefRoot, movieFactory, movieListFactory){
    
const dbRefMovies = dbRefRoot.child('movies')

this.get = id => movieFactory(dbRefMovies.child(id))
this.getAll = () => movieListFactory(dbRefMovies)
this.getDefaults = () => movieFactory(dbRefMovies.child(0))
}

function MovieCtrl(movies) {
    
    this.newMovie = movies.getDefaults()
    this.movie = movies.get('whatever')
    this.movies = movies.getAll()
    this.remove = movie => {
        
        if (confirm('Delete this movie')) {
            this.movies.$remove(movie)
        }
    }
      this.save = movie => { this.movies.$save(movie) }
    this.addMovie = newMovie => {
        
        this.movies 
        .$add(newMovie)
        .then( newRef => {this.newMovie = movies.getDefaults() })
    }
    
    
    
    
    
}


    
    