namespace $ {

	const lines = [] as string[]

	const colors = {
		'' : $node.colorette.gray,
		come : $node.colorette.blue,
		done : $node.colorette.green,
		fail : $node.colorette.red,
		warn : $node.colorette.yellow,
		rise : $node.colorette.magenta,
		area : $node.colorette.cyan,
	}

	const stat = new Map< string , number >()

	function emit() {

		if( lines.length === 0 ) return
		
		const input = $mol_tree.fromString( lines.join('') , `stdin` )
		lines.length = 0

		const values = input.select( '' , '' ).sub.map( field => {
			
			let json = field.sub[0].toJSON()
			let str = ( typeof json === 'string' ) ? json : JSON.stringify( json )

			let width = stat.get( field.type ) ?? 0
			if( str.length > width ) {
				stat.set( field.type , str.length )
			}
			
			if( !Number.isNaN( parseFloat( str ) ) ) {
				width = Math.max( width , 8 )
			}

			str = str.padEnd( width )

			return str

		} )

		let str =  values.join( ' ' )

		if( process.stdout.isTTY ) {
			const color = colors[ input.sub[0].type ] || colors['']
			str = color( str )
		}
		
		console.log( str )

	}

	process.stdin.pipe( $node.split() )
	.on( 'data' , ( line : string )=> {
		if( line[0] !== '\t' ) emit()
		if( line ) lines.push( line + '\n' )
	} )

}
