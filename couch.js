modules.export = function(){
var Couchdb = function(database){
        var ldbs = [] ;
	var conf = CONFIG.couchdb;
	this.database = database;       
	this.get = {}
	this.get.databases = function(){
		return ldbs ;
	}
        /**
         * This function will execute a view and filter the view
         * The namespace has been hard-coded becuase we do
         */
        this.get.view = function(db,design,view,key,reduce){
//            namespace = 'find'
            host = CONFIG.couchdb['read.host']
            url     = ([/*conf.host,':',conf.port*/ host,'/',db,'/_design/',design,'/_view/',view]).join('') ;
            
            p = []
            if(reduce != null){
                //
                // we need to add a reduce parameter here ...
                p.push('reduce=true&group=true')
            }
            if(key != null){
                if(key.constructor != Array){
                    p.push((['key=%22',key,'%22']).join('')) ;
                }else{
                    p.push("keys="+encodeURIComponent(JSON.stringify(key)))
                }
            }
            if(p.length > 0){
                p.splice(0,0,'?') ;
                
                url = url + (p.join('&')).replace('?&','?').replace(/ /g,'+') ;
            }
            
            r = "0";
            try{
//                console.log(url)
                options = {}
                options.url = url ;
                options.headers = {'Content-Type':'application/json'} ;
                options.method = 'GET' ;
                r = http.request(options) ;
                r = r.end();
                
                r = eval("("+r.data+")") ;
                
                if(r.error == null){
                    if(reduce != null){
                        r = r.rows ;
                    }else{
                        if(key != null){
                            if(r.rows.length > 0){
                                    r = jx.utils.vector('value',r.rows);//[0].value ;
                            }
                        }else{
                            //
                            // calling in jx function to generate an array/vector from an attribute
                            //                        
                                r = jx.utils.vector('value',r.rows)
                        }
                    }
                }
            }catch(e){
                console.log(e)
            }
            return r ;
        }
	this.get.doc = function(db,doc){
                host = CONFIG.couchdb['read.host']
		url 	= ([/*conf.host,':',conf.port*/ host,'/',db,'/',doc]).join('')
               
		try{
                        options = {} ;
                        options.url = url;
                        options.headers = {
                            'Content-Type':'application/json'
                        }                        
                        options.method = 'GET'
			r	= http.request(options); 
                        r       = r.end();
			stream 	= (r != null?r['data'].toString():r)
			
                        if(stream != null){
				r =  eval("("+stream+")") ;
				if (r.error !=null){
					return  null;
				}else{
					return r ;
				}
			}
		}catch(e){
			console.log("error %s",e)
		}
		return null;
	}

	this.set = {}
	//
	// This function will create a document in a designated database
	// @pre : this.get.doc(db,id) == null
	//
	this.set.doc = function(db,id,body){
		rev 	= "0";
		try{
                        host = CONFIG.couchdb['write.host']
			url 	= ([/*conf.host,':',conf.port*/ host,'/',db,'/',id]).join('') 
                        
			options = {}
			options.url 	= url
			options.method	= 'PUT'
			rq 	= http.request(options) ;
			rq.write(JSON.stringify(body)) 
			r 	= (eval(rq.end()));
			r 	= eval("("+r.data.toString()+")") ;                       
			rev 	= r.rev
		}catch(e){
			console.log(url+"\n"+e) ;
                        
		}
		return rev ;
		
	}
	//
	// @param db	database name
	// @param doc	document to be updated
	// @param id	identifier of the attachment
	// @param file	file to attach to the given document
	// 
	this.set.attach = function(db,doc,id,attachment){
		rev = doc._rev
                host = CONFIG.couchdb['write.host']
		url = ([/*conf.host,':',conf.port*/ host,'/',db,'/',doc._id,'/',id,'?rev=',rev]).join('')	
		options = {}
		options.url = url
		options.method = 'PUT';
		options.headers ={
			'Content-Type':'text/plain'
		}
		rq = http.request(options);
		rq.write(attachment);
		r = rq.end();
		


	}
		
}

}

