var Widget = React.createClass({
	getInitialState: function() {
		return { data: {} };
	},
	render: function() {
		return (
			<li class="widget">
				Hallo
				{this.state.data}
			</li>
		);
	},
	onUpdate: function(data){
		this.setState({
			data: data
		});
	}
});


var Widgets = React.createClass({
	render: function() {
		var widgets = this.props.widgets.map(function(widget) {
			return (
				<Widget />
			);
		}.bind(this));

		return (
			{widgets}
		);
	}
});


var InterfaceMain = React.createClass({
	getInitialState: function() {
		return { widgets: [] };
	},
	componentDidMount: function() {
		window.interfaceMain = this;
	},
	render: function() {
		return (
			<Widgets />
		);
	},
	onUpdate: function(widgets){
		this.setState({
			widgets: widgets
		});
	}
});


ReactDOM.render(
	<InterfaceMain />,
	document.getElementById('wrapper')
)
