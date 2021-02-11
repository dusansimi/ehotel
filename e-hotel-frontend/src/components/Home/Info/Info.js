import React from 'react';
import './Info.css';

const info = () => {
	return (
		<div className=" container flex-column d">
			<h1 className="text-center">O Hotelu...</h1>
			<p className="par">
				{' '}
				Hotel osnovan davne 1967. godine, sa predivnim dizajnom koji uzima
				inspiraciju iz starog Rimskog arhitektonskog stila. Uz prelep eksterijer
				i moderan enterijer, imacete priliku da uzivate i u veoma bogatoj ponudi
				usluga kao i hrane. Nas hotel raspolaze prostranim luksuznim restoranom
				koji u ponudi ima hranu iz 16 razlicitih nacionalnih kuhinja. Osim
				restorana, hotel ima svoj bazen, teretanu, saunu i salone za masazu. Na
				raspolaganju je 5 vrsta soba koje mozete rezervisati: jednokrevetne,
				dvokrevetne, trokrevetne, cetvorokrevetne, apartmani, kao i luksuzni
				kraljevski apartmani.{' '}
			</p>
		</div>
	);
};

export default info;
