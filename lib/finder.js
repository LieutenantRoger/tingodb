var safe = require('safe');
var _ = require('underscore');

var ops = {
	$range : function () {
		this.op = "$range";
		this.dump = function () {
			return this._args[0].dump() +" in range (" +this._args[1].dump()+","+this._args[2].dump()+","+this._args[3].dump()+","+this._args[4].dump()+")";
		},
		this._index = function (index) {
			return index.range(this._args[1]._get(),this._args[2]._get(),this._args[3]._get(),this._args[4]._get());
		}
	},
	
	$lt : function () {
		this.op = "$lt";
		this._index = function (index) {
			return index.range(null,this._args[1]._get(obj),false,false);
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}
		this.dump = function () {
			return this._args[0].dump() +" < " +this._args[1].dump()
		}
		this.native = function () {
			return this._args[0].native() +" < " +this._args[1].native()
		}		
		this.native3 = function () {
			var s = "(function () {\n";
			s+= "var v = "+this._args[0].native3()+"\n";
			s+= "if (!v) return false;\n";				
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+= "if (v[i]<"+ this._args[1].native3()+") return true;\n"
			s+= "}\nreturn false;})()";
			return s;
		}
		this._index = function (index) {
			return index.range(null,this._args[1]._get(),false, true);
		}		
	},
	$lte : function () {
		this.op = "$lte";
		this._index = function (index) {
			return index.range(null,this._args[1]._get(obj),false,false);
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}
		this.dump = function () {
			return this._args[0].dump() +" <= " +this._args[1].dump()
		}
		this.native = function () {
			return this._args[0].native() +" <= " +this._args[1].native()
		}		
		this._index = function (index) {
			return index.range(null,this._args[1]._get(),false, false);
		}	
		this.native3 = function () {
			var s = "(function () {\n";
			s+= "var v = "+this._args[0].native3()+"\n";
			s+= "if (!v) return false;\n";				
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+= "if (v[i]<="+ this._args[1].native3()+") return true;\n"
			s+= "}\nreturn false;})()";
			return s;
		}
	},
	$gt : function () {
		this.op = "$gt";
		this._index = function (index) {
			return index.range(this._args[1]._get(),null,true,false);
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}
		this.dump = function () {
			return this._args[0].dump() +" > " + this._args[1].dump()
		}
		this.native = function () {
			return this._args[0].native() +" > " +this._args[1].native()
		}		
		this.native3 = function () {
			var s = "(function () {\n";
			s+= "var v = "+this._args[0].native3()+"\n";
			s+= "if (!v) return false;\n";			
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+= "if (v[i]>"+ this._args[1].native3()+") return true;\n"
			s+= "}\nreturn false;})()";
			return s;
		}
	},
	$gte : function () {
		this.op = "$gte";
		this._get = function (obj) {
			return this._args[0]._get(obj) >= this._args[1]._get(obj);
		}
		this._index = function (index) {
			return index.range(this._args[1]._get(),null,false,false);
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}
		this.dump = function () {
			return this._args[0].dump() +" >= " + this._args[1].dump()
		}
		this.native = function () {
			return this._args[0].native() +" >= " +this._args[1].native()
		}			
		this.native3 = function () {
			var s = "(function () {\n";
			s+= "var v = "+this._args[0].native3()+"\n";
			s+= "if (!v) return false;\n";			
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+= "if (v[i]>="+ this._args[1].native3()+") return true;\n"
			s+= "}\nreturn false;})()";
			return s;
		}
	},
	$eq : function () {
		this.op = "$eq";
		this._index = function (index) {
			return index.match(this._args[1]._get());
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}		
		this.dump = function () {
			return this._args[0].dump() +" = " + this._args[1].dump()
		}		
		this.native = function () {
			return this._args[0].native() +" == " +this._args[1].native()
		}		
		this.native3 = function () {
			var s = "(function () {\n";
			s+= "var v = "+this._args[0].native3()+"\n";
			s+= "if (!v) return false;\n";
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+= "if (v[i]=="+ this._args[1].native3()+") return true;\n"
			s+= "}\nreturn false;})()";
			return s;
		}
	},
	$ne : function () {
		this.op = "$ne";
		this._index = function (index) {
			var m = index.match(this._args[1]._get());
			var a = index.all();
			return _.difference(a,m);
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}		
		this.dump = function () {
			return this._args[0].dump() +" != " + this._args[1].dump()
		}		
		this.native = function () {
			return this._args[0].native() +" != " +this._args[1].native()
		}		
		this.native3 = function () {
			var s = "(function () {\n";
			s+= "var v = "+this._args[0].native3()+"\n";
			s+= "if (!v) return true;\n";
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+= "if (v[i]=="+ this._args[1].native3()+") return false;\n"
			s+= "}\nreturn true;})()";
			return s;
		}
	},
	$in : function () {
		this.op = "$in";
		this._index = function (index) {
			var m = [];
			for (var i=1; i<this._args.length; i++)
				m = _.union(m,index.match(this._args[i]._get()));
			return m;
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}		
		this.dump = function (obj) {
			var s = this._args[0].dump()+" in [";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i].dump();
				if (i!=this._args.length-1)
					s+=",";
			}
			return s+"]";
		}
		this.native = function (obj) {
			if (this._args.length==1)
				return "true";
			var s = "(function (obj) {\n"
			s+="var v = "+this._args[0].native()+";\n";
			s+="var args=[";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i]._get();
				if (i!=this._args.length-1)
					s+=",";
			}
			s+="];\n"
			s+="for (var i=0; i<args.length; i++) { if (args[i]==v) return true };\n"
			s+="return false;\n"
			s+="})(obj)";
			return s;
		}	
		this.native3 = function (obj) {
			if (this._args.length==1)
				return "false";
			var s = "(function (obj) {\n"
			s+="var v = "+this._args[0].native3()+";\n";
			s+= "if (!v) return false;\n";				
			s+="var args=[";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i]._get();
				if (i!=this._args.length-1)
					s+=",";
			}
			s+="];\n"
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+="for (var j=0; j<args.length; j++) { if (args[j]==v[i]) return true };\n"
			s+="};return false;\n"
			s+="})(obj)";
			return s;
		}		
	},
	$nin : function () {
		this.op = "$nin";
		this._index = function (index) {
			var m = [];
			for (var i=1; i<this._args.length; i++)
				m = _.union(m,index.match(this._args[i]._get()));
			var a = index.all();
			return _.difference(a,m);				
		},
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}		
		this.dump = function (obj) {
			var s = this._args[0].dump()+" nin [";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i].dump();
				if (i!=this._args.length-1)
					s+=",";
			}
			return s+"]";
		}
		this.native = function (obj) {
			if (this._args.length==1)
				return "true";
			var s = "(function (obj) {\n"
			s+="var v = "+this._args[0].native()+";\n";
			s+="var args=[";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i]._get();
				if (i!=this._args.length-1)
					s+=",";
			}
			s+="];\n"
			s+="for (var i=0; i<args.length; i++) { if (args[i]==v) return false };\n"
			s+="return true;\n"
			s+="})(obj)";
			return s;
		}		
		this.native3 = function (obj) {
			if (this._args.length==1)
				return "true";
			var s = "(function (obj) {\n"
			s+="var v = "+this._args[0].native3()+";\n";
			s+= "if (!v) return true;\n";				
			s+="var args=[";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i]._get();
				if (i!=this._args.length-1)
					s+=",";
			}
			s+="];\n"
			s+= "for (var i=0; i<v.length; i++ ) {\n";
			s+="for (var j=0; j<args.length; j++) { if (args[j]==v[i]) return false };\n"
			s+="};return true;\n"
			s+="})(obj)";
			return s;
		}		
	},
	$all : function () {
		this.op = "$all";
		this._ex = function (f) {
			if (this.fields()[f]!=null)
				return 1;
			else 
				return -1;
		}			
		this._index = function (index) {
			var m = [];
			for (var i=1; i<this._args.length; i++) {
				if (i==1)
					m = index.match(this._args[i]._get());
				else
					m = _.intersection(m,index.match(this._args[i]._get()));
			}
			return m;				
		},		
		this.native = function (obj) {
			if (this._args.length==1)
				return "true";
			var s = "(function (obj) {\n"
			s+="var v = "+this._args[0].native()+";\n";
			s+= "if (!v) return false;\n";				
			s+="var args=[";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i]._get();
				if (i!=this._args.length-1)
					s+=",";
			}
			s+="];\n"
			s+= "for (var i=0; i<args.length; i++ ) {\n";
			s+="for (var j=0; j<v.length; j++) { if (v[j]==args[i]) break; };\n"
			s+="if (j==v.length) return false;\n";
			s+="};return true;\n"
			s+="})(obj)";
			return s;
		},			
		this.native3 = function (obj) {
			if (this._args.length==1)
				return "true";
			var s = "(function (obj) {\n"
			s+="var v = "+this._args[0].native3()+";\n";
			s+= "if (!v) return false;\n";				
			s+="var args=[";
			for (var i=1; i<this._args.length; i++) {
				s+=this._args[i]._get();
				if (i!=this._args.length-1)
					s+=",";
			}
			s+="];\n"
			s+= "for (var i=0; i<args.length; i++ ) {\n";
			s+="for (var j=0; j<v.length; j++) { if (v[j]==args[i]) break; };\n"
			s+="if (j==v.length) return false;\n";
			s+="};return true;\n"
			s+="})(obj)";
			return s;
		}		
	},
	$not : function () {
		this.op = "$not";
		this._index = function (index) {
			var m = this._args[1]._index(index);
			var a = index.all();
			return _.difference(a,m);				
		},
		this._ex = function (f) {
			return this._args[1]._ex(f);
		}		
		this.dump = function () {
			return "!("+this._args[1].dump()+")";
		}
		this.native = function () {
			return "!("+this._args[1].native()+")";
		}		
		this.native3 = function () {
			return "!("+this._args[1].native3()+")";
		}		
	},
	$and : function () {
		this.op = "$and";
		this._index = function (index) {
			var ops = [];
			for (var i=0; i<this._args.length; i++) {
				ops.push(this._args[i]._index(index));
			}
			return _.intersection.apply(_,ops);
		}
		this.split = function (f) {
			var s = new ops.$and();
			var d = [];
			var o = [];
			for (var i=0; i<this._args.length; i++) {
				if (this._args[i].op=="$and" || this._args[i].op=="$or" ) {
					var sub = this._args[i].split(f);
					d.push(sub);
					if (this._args[i].length>0)
						o.push(this._args[i]);
				} else {
					var ex = this._args[i]._ex(f);
					if (ex==1)
						d.push(this._args[i])
					else
						o.push(this._args[i])
				}
			}
			// special check for paired ops
			var l=null,g=null;
			for (var i=0; i<d.length; i++) {
				if (d[i].op=="$lt" || d[i].op=="$lte")
					l = i;
				if (d[i].op=="$gt" || d[i].op=="$gte")
					g = i;
			}
			if (l!=null && g!=null) {
				var r = new ops.$range();
				r._args = [d[l]._args[0]];
				r._args.push(d[g]._args[1]);
				r._args.push(d[l]._args[1]);				
				r._args.push(new value(d[g].op=="$lte"?0:1));
				r._args.push(new value(d[l].op=="$gte"?0:1));
				d.splice(l,1);
				d.splice(l<g?g:g-1,1);
				d.push(r);
			}
			s._args = d;
			this._args = o;
			return s;
		}			
		this._ex = function (f) {
			var r = -1;
			for (var i=0; i<this._args.length; i++) {
				var ex = this._args[i]._ex(f);
				if (ex==0)
					return 0;
				if (ex==1)
					r=1;
			}
			return r;
		}
		this.dump = function (obj) {
			var s = "("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].dump();
				if (i!=this._args.length-1)
					s+=",";
			}
			return s+")";
		}
		this.native = function (obj) {
			if (this._args.length==0)
				return "true";
			var s = "("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].native();
				if (i!=this._args.length-1)
					s+=" && ";
			}
			return s+")";
		}		
		this.native3 = function (obj) {
			if (this._args.length==0)
				return "true";
			var s = "("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].native3();
				if (i!=this._args.length-1)
					s+=" && ";
			}
			return s+")";
		}		
	},
	$or : function () {
		this.op = "$or";
		this._ex = function (f) {
			return 0;
		}
		this.dump = function (obj) {
			var s = "("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].dump();
				if (i!=this._args.length-1)
					s+=" || ";
			}
			return s+")";
		}
		this.native = function (obj) {
			if (this._args.length==0)
				return "true";
			var s = "("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].native();
				if (i!=this._args.length-1)
					s+=" || ";
			}
			return s+")";
		}		
		this.native3 = function (obj) {
			if (this._args.length==0)
				return "true";
			var s = "("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].native3();
				if (i!=this._args.length-1)
					s+=" || ";
			}
			return s+")";
		}		
	},
	$nor : function () {
		this.op = "$nor";
		this._ex = function (f) {
			return 0;
		}
		this.dump = function (obj) {
			var s = "!("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].dump();
				if (i!=this._args.length-1)
					s+=" || ";
			}
			return s+")";
		}
		this.native = function (obj) {
			if (this._args.length==0)
				return "true";
			var s = "!("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].native();
				if (i!=this._args.length-1)
					s+=" || ";
			}
			return s+")";
		}			
		this.native3 = function (obj) {
			if (this._args.length==0)
				return "true";
			var s = "!("
			for (var i=0; i<this._args.length; i++) {
				s+=this._args[i].native3();
				if (i!=this._args.length-1)
					s+=" || ";
			}
			return s+")";
		}			
	}	
}

_(ops).forEach(function (op) {
	op.prototype.fields = function () {
		var f = {};
		var _args = this._args;
		_(this._args).forEach(function (a) {
			if (a.op=="f")
				f[a.f]=1;
			else if (a.op!="v") {
				var s = a.fields();
				_(s).forEach(function (n,k) {
					f[k]=1;
				})
			}
		})
		return f;
	}
})

var field = function (k) {
	this.op = "f";
	this.f = k;
	this.dump = function () {
		return k;
	}
	this.native = function () {
		var path = k.split(".");
		if (path.length==1)
			return "obj."+k;
		else {
			var s = "(";
			var ps = "obj";
			for (var i=0;i<path.length;i++) {
				ps+="."+path[i];
				if (i!=path.length-1)
					s+=ps+ " && ";
				else
					s+=ps + " || null)"
			}			
			return s;
		}
	}	
	this.native3 = function () {
		function steep(ps, path, i) {
			ps+="."+path[i];			
			if (path.length==i)
				return "";
			i++;				
			var s = "";
			s+= "v"+i+"="+ps+"\n";			
			s+= "if (!v"+i+") return null;\n"
			if (path.length!=i) {
				s+= "if (Array.isArray(v"+i+")) {\n";
				s+= "for (i"+i+"=0; i"+i+"<v"+i+".length; i"+i+"++) {\n";
				s+= steep("v"+i+"[i"+i+"]",path,i);
				s+= "}\n}\nelse\n{\n";
				s+= steep("v"+i,path,i);
				s+= "}\n"
			} else
				s+= "res.push(v"+i+")\n";
			return s;
		};
			
		var path = k.split(".");
		if (path.length==1)
			return "[obj."+k+"]";
		else {
			var s = "(function () {\n";
			var ps = "obj";
			s+="var res=[]\n";
			for (var i=0; i<path.length; i++) {
				s+="var v"+i+",i"+i+";\n";
			}
			s+=steep(ps,path,0);
			return s+"\nreturn res;})()";
		}

	}	
}


var value = function (v) {
	this.op = "v";
	this.v = v;
	this._get = function (obj) {
		return v;
	}
	this.dump = function () {
		return v;
	}
	this.native = function () {
		return v;
	}
	this.native3 = function () {
		return v;
	}	
}

function stree(query,ctx) {
	var _query = _(query);
	var args = [];
	if (_query.isArray()) {
		_query.forEach(function (v) {
			var sub = stree(v);
			_(sub).forEach(function (v) {
				args.push(v);
			})
		})
	} else if (_query.isObject()) {
		_query.forEach(function (v,k) {
			var op = ops[k];
			var n = null;		
			if (op!=null) {
				n = new op();
				n._args = stree(v,ctx);
				if (ctx!=null)
					n._args.splice(0,0,ctx);
				args.push(n);					
			}
			else {
				if (_(v).isObject()) {
					var sub = stree(v,new field(k));
					if (sub.length==1)
						args.push(sub[0]);
					else if (sub.length>1) {
						n = new ops["$and"];
						n._args = sub;
						args.push(n);
					}
				} else {
					n = new ops["$eq"]();
					n._args = [new field(k)];
					var sub = stree(v);
					_(sub).forEach(function (v) {
						n._args.push(v);
					})						
					args.push(n);						
				}
			}
		})
	} else {
		return [new value(query)];
	}
	return args;
}

module.exports.matcher = function (query) {
	if (_(query).size()==0) 
		return function () { return true; }	
	var aq = [];
	_(query).each(function (v,k) {
		o = {};	o[k]=v;
		aq.push(o)
	})
	var wrap={$and:aq};
	var res = stree(wrap);
	return res[0];
}

module.exports.field = field;