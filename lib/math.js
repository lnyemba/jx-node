/**
* (c) 2011 jxf, Javascript Frameworks
* Steve L. Nyemba <nyemba@gmail.com>
*
* dependencies:
*	utils.js
*	
* This file contains an enhancement of utilities integrated into the jx.math.* built-in package of javascript
* jx.math.avg
* jx.math.mean		computes the mean/average of a list of observations (arthmetic mean included too)
* jx.math.sd		computes the standard deviation of a list of observations
* jx.math.var		computes the variance of a list of observations
* jx.math.diff		computes the absolute difference of values in an array
* jx.math.fibonacci	comptutes the fibonacci value of a given number
* jx.math.factorial	computes the factorial of a given number
*/
if(!jx){
	var jx = {} ;
	
}
jx.math = {}
jx.math.sqrt = Math.sqrt;
jx.math.PHI = (1+jx.math.sqrt(5))/2 ;//1.61803399 ;
jx.math.pow = Math.pow ;
/**
* @param lxi list of observatins xi
*/

jx.math.max = function(lxi){
 sortNumber= function(a,b) {
    return a - b;
    }
	 index = lxi.length -1 ;
	 max = jx.utils.cast(lxi,Number).sort(sortNumber)[index] ;	// perhaps need to cast
	 return max ;
}
/**
* finds the minimum of a list of observation lxi (vector of values)
* @param lxi list/vector of values/observations
*/ 
jx.math.min = function(lxi){
	sortNumber = function(a,b){
		return a- b;
	}
	min = jx.utils.cast(lxi,Number).sort(sortNumber)[0] ;
	return min ;
}
/**
* @pre : values.constructor == Array
* @param lxi list of observed values to be summed
*/
jx.math.sum = function(lxi){
    
    var total = eval( lxi.join('+') ) ;
    return Number(total);
} ;

/**
* @pre : lni != null && lxi.length == lni.length
* @param lxi list of observed values
* @param lni list of the number of times observations of index i have been made
*/
jx.math.avg = function(lxi,lni){
    N = lxi.length  ;
    lxi = jx.utils.patterns.visitor(lxi,Number) ;
    if(lni == null){
        return jx.math.sum(lxi)/N ;
    }else{
        values = []
	lni = jx.utils.patterns.visitor(lni,Number) ;
        for(var i=0; i < lxi.length; i++){
            values[i] = lxi[i]*lni[i] ;
        }
        return (jx.math.sum(values)/N) ;
    }
};

jx.math.mean = jx.math.avg ;
jx.math.sd = function(lxi,lni){
    N = lxi.length ;
    mean = jx.math.mean(lxi,lni) ;
    
    sqr = [] ;
    for(var i=0; i < lxi.length ;i++){
       sqr[i] = jx.math.pow((Number(lxi[i])-mean),2 ) ;
    }

    total = jx.math.sum(sqr);
    
    return jx.math.sqrt(total/(N-1)) ;
} ;

/**
* Computes the factorial of a given value
*/
jx.math.factorial = function(value){
    r =value;
    for(var i =value-1; i > 0; i--){
        r *= i ;
    }
    
    return r;
} ;

/**
* Computes the fibonacci value of a given number using the golden ratio
*/
jx.math.fibonacci = function(value){
    r = (jx.math.pow(jx.math.PHI,value)/jx.math.sqrt(5)) + 0.5 ;
    return jx.math.floor(r) ;
} ;

/**
* computes the absolute difference of values in a list of observations
*/
jx.math.diff = function(lxi){
    var r = [] ;
    var x,y;
    for(var i=0; i < lxi.length-1; i++){
        x = lxi[i] ;
        y = lxi[i+1] ;
        r.push(y-x)
    }
    return r ;
};

/**
 * This section implements a few handlers based on sets
 */
jx.math.sets = {} ;
/**
 * This function will perform a unique operation of values/objects
 * @param list	list/vector of values or objects
 * @param equals	operator to be used, only provide this for complex objects
 */
jx.math.sets.unique = function(list,equals){
	rvalues = [] ;
	map = {}
	for(var i=0; i < list.length; i++){
		item = list[i]
		r = jx.utils.patterns.visitor(
				rvalues,
				function(ritem){
					found = null;
					if(equals != null){
							found  = (equals(item,ritem) == true)?true:null;
					}else{
						//
						// The user has not specified an "equal" operator and we will use the default one
						// This will assume either a primitive type or a string anything else and you're on your own
						//
						found = (ritem==item)?true:null
					}
					return found
		})
		//
		// At this point we must consider the following:
		// But it the pattern result has a length of the same size as the original rvalues 
		//		Then it would suggest that nulls were returned for every instance in rvalues no match found
		// NOTE: If the visitor function returns nulls the pattern function returns the original list assuming a change to the list was performed (bug that needs fixing)
		//
		if(r.length == rvalues.length){
			rvalues.push(item)
		}
		
	}
	return rvalues;
}
jx.math.sets.join = function(lattr,r){
    for(i in r){
        
    }
}
/**
 * This function will perform the union of 2 sets (objects, or values)
 * @param list1		list/vector of values or objects
 * @param list2		list/vector of values or objects
 * @param equals	operator to be used to evaluate equality (use this for complex objects)
 */
jx.math.sets.union = function(list1,list2,equals){
	runion = [] ;
	runion = list1.concat(list2) ;
	runion = jx.math.sets.unique(runion,equals)
	return runion;
}
/**
* This function will normalize a vector, it can be used for feature scaling or mean normalization.
* The patterns are the same but the values 
* @param n_value 	numerator that will be substracted from the xi (observation)
* @param d_value	denominator that will device the difference computed
*/
jx.math.normalize = function(values,n_value,d_value){
	values = jx.utils.patterns.visitor(values,Number) ;	
	values = jx.utils.patterns.visitor(values,function(x){
		return (x - n_value)/d_value ;
	});
	return values;
}
/**
* This is a lightweight map reduce infrastructure
*/
jx.mr = {} ;
/**
* This function will perform a map on a given id in rec, then will call emit with the 	 
*/
jx.mr.map = null
/**
* @param keys
* @param values array of values that were mapped 
*/
jx.mr.reduce = null;
jx.mr.mapreduce = function(data,fn_map,fn_reduce){
	if (fn_map == null){
		throw new "Map function is not defined"
	}
	map = {} ;
	emit = function(id,values){
		if(map[id] == null){
			map[id]  = []
		}
		map[id].push(values);
	}
	if(data.constructor != Array){
		for (id in data){
			//rec = data[id] ;
			rec = {}
			rec['__id'] = id;
			rec['data'] = data[id] ;
			fn_map(rec,emit)

		}
	}else{
		for (var i=0; i < data.length; i++){
			rec = data[i];
			fn_map(rec,emit);
			//if(i == 2)break;
		}
	}
	if(fn_reduce != null){
		keys = jx.utils.keys(map) ;
		m = {}
		for(var i=0; i < keys.length; i++){
			id = keys[i] ;
			values = map[id] ;
			value = fn_reduce(id,values) ;
			id = keys[i] ;
			m[id] = value;

		}
		map = m

	}
	return map ;
}

jx.math.mapr = jx.mr ;
/**
* Exporting the modules by nodejs specifications
*/
module.exports.math = jx.math ;
