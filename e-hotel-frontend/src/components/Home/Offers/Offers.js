import React from 'react';
import { Container, Row, Image, Col } from 'react-bootstrap';
import Image1 from '../../../assets/images/1.png';
import Image2 from '../../../assets/images/2.png';
import Image3 from '../../../assets/images/3.png';
import Image4 from '../../../assets/images/4.png';
const offers = () => {
	return (
		<Container className="bg" fluid>
			<Row>
				<Col lg="3" className="text-center">
					<Image src={Image1} roundedCircle width="250" height="250" />
					<p>Online rezervacija soba</p>
				</Col>
				<Col lg="3" className="text-center">
					<Image src={Image2} roundedCircle width="250" height="250" />
					<p>Online porucivanje hotelskih usluga</p>
				</Col>
				<Col lg="3" className="text-center">
					<Image src={Image3} roundedCircle width="250" height="250" />
					<p>Preuzimanje kljuca do sobe online, bez rececpcije </p>
				</Col>
				<Col lg="3" className="text-center">
					<Image src={Image4} roundedCircle width="250" height="250" />
					<p>Raznovrsna ponuda hrane i pica</p>
				</Col>
			</Row>
		</Container>
	);
};

export default offers;
