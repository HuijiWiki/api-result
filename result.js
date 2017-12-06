class Result {
	constructor(parsed, configItem) {
		this.parsed = parsed;
		this.source = (configItem.source || 'STAFF').toUpperCase();
		this.type = (configItem.type || 'app').toUpperCase();
		this.res = '';
		this.secondaryParse();
		this.postProcess();
		this.format();
	}

	get message() {
		return this.res;
	}

	format() {
		let s = {
			'api' : {
				'source': this.source,
				'type': this.type,
				'app_id': this.parsed['id']
			},
			'id' : this.parsed['id'],
			'dated_data' : {
				'date' : new Date().toISOString().slice(0,10),
				'data' : this.parsed 
			}
		}
		this.res = JSON.stringify(s);
	}

	secondaryParse() {
	
		let work = this.parsed;
		Object.keys(work).map( (key, index) => {
			let slice = key.split('@');
			if (slice.length > 1){
				work[slice[0]] = [{
					'text' : work[key],
					'language' : slice[1],
					'source' : this.source 
				}];
				delete work[key];
			}
		} );
		this.parsed = work;

	}

	postProcess(){

		let line = JSON.stringify(this.parsed);
		const ir = /\$\$(\d+)/g;
		const dr = /\#\#([\/\w\s_-]+)/g;
		this.parsed = line.replace(ir, (match, p1, offset, str) => { return parseInt(p1)+Math.pow(2, 32)-1; } )
				.replace(dr, (match, p1, offset, str)=>{ return Date.parse(p1); });
		this.parsed = JSON.parse(this.parsed);
	
	}
}
module.exports = Result;
