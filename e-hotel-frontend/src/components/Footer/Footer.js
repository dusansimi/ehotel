import React from 'react';
import './Footer.css';

const footer = () => {
	return (
		<footer>
			<div className="footer-top">
				<div className="container">
					<div className="row">
						<div className="md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12 segment-one">
							<h2>E-Hotel</h2>
							<p>
								Web aplikacija za rezervacije i koriscenje hotelskih usluga.
							</p>
						</div>
						<div className="md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12 segment-two">
							<h2>Linkovi</h2>
							<ul>
								<li>
									<a href="/">Tehnicka podrska</a>
								</li>
								<li>
									<a href="/">Kontakt</a>
								</li>
								<li>
									<a href="/">Recenzije</a>
								</li>
							</ul>
						</div>
						<div className="md-mb-30 sm-mb-30 col-md-4 col-sm-6 col-xs-12 segment-three">
							<h2>Zapratite nas</h2>
							<p>
								Pomocu linkova ispod nas mozete zapratiti na drustvenim mrezama.
							</p>
							<a href="www.facebook.com">
								<i className="fa fa-facebook"></i>
							</a>
							<a href="/">
								<i className="fa fa-twitter"></i>
							</a>
							<a href="/">
								<i className="fa fa-linkedin"></i>
							</a>
							<a href="/">
								<i className="fa fa-pinterest"></i>
							</a>
						</div>
					</div>
				</div>
			</div>
			<p className="footer-bottom-text">All Rights reserved by &copy;E-hotel</p>
		</footer>
	);
};

export default footer;
