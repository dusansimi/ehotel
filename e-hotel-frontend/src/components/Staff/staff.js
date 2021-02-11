import React from 'react';
import { connect } from 'react-redux';
import MUIDataTable from 'mui-datatables';
import Axios from 'axios';
import { toast } from 'react-toastify';
const columns = ['ID', 'Ime', 'Broj sobe', 'Ime Servisa'];

class Staff extends React.Component {
	state = {
		niz: [],
	};
	componentDidMount() {
		const config = {
			headers: { Authorization: `Bearer ${this.props.token}` },
		};
		Axios.get('http://localhost:8000/api/servicebookings', config)
			.then((response) => {
				console.log(response);
				this.setState({ niz: response.data.data.doc });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	render() {
		const options = {
			filterType: 'checkbox',
			onRowsDelete: (rowsDeleted, newData) => {
				console.log('rowsDeleted');
				console.log(rowsDeleted);
				const idsToDelete = rowsDeleted.data.map((el) => el.dataIndex);
				const infoToDelete = idsToDelete.map((el) => {
					return this.state.niz[el];
				});
				console.log(idsToDelete);
				console.log(infoToDelete);
				const config = {
					headers: { Authorization: `Bearer ${this.props.token}` },
				};
				infoToDelete.forEach((element) => {
					Axios.delete(
						'http://localhost:8000/api/servicebookings/' + element._id,
						config
					)
						.then((response) => {
							toast('Uspesno obrisan', { type: 'success' });
						})
						.catch((err) => {
							console.log(err);
						});
				});
			},
		};
		let pom = [];
		if (this.state.niz.length > 0) {
			pom = this.state.niz.map((el) => {
				return [el._id, el.user.name, el.room.number, el.service.name];
			});
		}
		console.log(pom);
		return (
			<div className="container-fluid">
				<MUIDataTable
					title={'Lista Servisa'}
					data={pom}
					columns={columns}
					options={options}
				/>
			</div>
		);
	}
}

const mapStatetoProps = (state) => {
	return {
		token: state.token,
		id: state.userID,
	};
};
export default connect(mapStatetoProps)(Staff);
