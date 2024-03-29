var Widget = React.createClass({
	getInitialState: function() {
		return { data: {} };
	},
	render: function() {
		var html = '';
		switch(this.props.type) {
			case 'commits':
				var commits = this.props.data.content.map(function(commit) {
					var commit = commit.commit;
					return <tr>
								<td><b className="width100">{commit.author.name}:</b></td><td>{commit.message}</td>
							</tr>;
				});
				html = <table cellSpacing="0">
						<tbody>
						{commits}
						</tbody>
					</table>;
				break;

			case 'hackernews':
			case 'producthunt':
			case 'committers':
			case 'list':
				var entries = this.props.data.content.map(function(entry) {
					return <div className="list-entry">{entry}</div>;
				});

				html = <div className="list">
						{entries}
					</div>;
				break;
			case 'github':
			case 'text':
				html = <p>{this.props.data.content}</p>;
				break;
			case 'twitch':
			case 'youtube':
			case 'video':
			case 'map':
				html = <iframe src={this.props.data.url} />
				break;

			case 'yodaquote':
			case 'quote':
				html = <p><b>{this.props.data.content.quote + "  "}</b><br/><i>- {this.props.data.content.author}</i></p>;
				break;

			case 'logo':
			case 'gif':
				var divStyle = {backgroundImage: 'url(' + this.props.data.url + ')'}
				html = <div className="image" style={divStyle} />
				break;

			case 'weather':
				var iconClass = 'fa fa-' + this.props.data.icon;
				html = <div className="weather">
							<div className="icon"><i className={iconClass}></i></div>
							<div className="degree">{this.props.data.degree}°C</div>
							<div className="location">{this.props.data.location}</div>
						</div>
				break;

			case 'topCommitter':
				html = <div className="text-center">
							<img src={this.props.data.user.avatar_url} />
							<p className="top20"><b>{this.props.data.user.login}</b></p>
							<p className="huge-text top20">{this.props.data.total}</p>
							<p className="top20">Commits</p>
						</div>
				break;

			case 'blame':
				html = <div className="text-center">
					<p><b>WANTED</b></p>
					<img src={this.props.data.content.actor.avatar_url} />
					<p className="top20"><b>{this.props.data.content.actor.login}</b></p>
					<p><b>Last Commit-Message:<br/></b></p>
					<p>{this.props.data.content.payload.commits[0].message}</p>
				</div>
				break;

		}

		var classes = "widget widget-" + this.props.type
		return (
			<li className={classes} data-col={this.props.col} data-row={this.props.row} data-sizex={this.props.sizex} data-sizey={this.props.sizey} >
				{html}
			</li>
		);
	},
	onUpdate: function(data){
		this.setState({
			data: data
		});
	}
});


var Grid = React.createClass({
	getInitialState: function() {
		return { widgets:
			{
				'map': {
					'type':'map',
					'data': {
						'url':'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d20145.441013409138!2d-0.0819660330810601!3d50.864864973999495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2suk!4v1461431861495'
					},
					'col':'1',
					'row':'1',
					'sizex':'3',
					'sizey':'2'
				},
				'weather': {
					'type':'weather',
					'data': {
						'degree':'6',
						'location':'Brighton, UK',
						'condition':'Mostly Cloudy',
						'icon':'cloud'
					},
					'col':'1',
					'row':'1',
					'sizex':'1',
					'sizey':'1'
				},
				'logo': {
					'type':'logo',
					'data': {
						'url':'https://scontent-lhr3-1.xx.fbcdn.net/hphotos-xaf1/v/t1.0-9/1917511_193904624321617_6591903680161746240_n.png?oh=247c05dfbb00a230ebe9f7eb6387174c&oe=5775B209'
					},
					'col':'1',
					'row':'1',
					'sizex':'1',
					'sizey':'1'
				},
				
				'gif': {
					'type':'gif',
					'data': {
						'url':'https://media.giphy.com/media/wpoLqr5FT1sY0/giphy.gif'
					},
					'col':'1',
					'row':'1',
					'sizex':'2',
					'sizey':'1'
				}
			}
		};
	},
	componentDidMount: function() {
		window.widgets = this;
      	this.setState({updateGrid: true});
	},
	componentDidUpdate: function() {
      	if(this.state.updateGrid) {
			$("ul").data("gridster", null);
			var gridster = $("ul").gridster({
	      		widget_base_dimensions: [200, 200],
	      		widget_margins: [10, 10],
	      		max_cols: 6,
	      		min_cols: 6,
	      		min_rows: 5,
	      		max_rows: 5,
	      		resize: {
	            enabled: true
	          }
	      	}).data('gridster');

	      	this.setState({
	      		gridster: gridster, 
	      		updateGrid: false
	      	});
	    }
	},
	render: function() {
		var widgets = $.map(this.state.widgets, function(widget, key) {
			return (
				<Widget key={widget.type} {...widget} />
			);
		});

		return (
			<ul className="gridster">
				{widgets}
			</ul>
		);
	},
	onUpdate: function(widgets){
		this.setState({
			widgets: widgets,
			updateGrid: true
		});
	}
});


var InterfaceMain = React.createClass({
	componentDidMount: function() {
		window.interfaceMain = this;
	},
	render: function() {
		return (
			<Grid />
		);
	}
});


ReactDOM.render(
	<InterfaceMain />,
	document.getElementById('wrapper')
)
