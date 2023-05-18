import React from "react";


import EasyTables from "../../../views/tables/components/EasyTables";
import { routes } from "../../../routes";

import { Tabs } from "antd";

const initialItems = [
    {
        label: "프로젝트 등록",
        children: <EasyTables />,
        key: "1",
    },
    {
        label: "재료비 내역",
        children: <EasyTables />,
        key: "2",
    },
    {
        label: "개발 외주비 내역",
        children: <EasyTables />,
        key: "3",
        closable: false,
    },
];

export default class TabView extends React.Component {
	constructor(props) {
		super(props);

		console.log("*TabView* props >", props);
		
		// route:  "/tables/jquery-tables",
		this.newTabIndex = 0;

		this.state = {
		  	key: props.name,
			// component: [],
			// addTab: {
				component: null,
			// }

			activeKey: initialItems[0].key, //1, 2, 3
            items: initialItems, //list
			label: props.label

		};

		this.getData()

	}

	getData() {
		// routes.filter( item =>item.name === this.props.name ?  this.setState({ component: item.component })  : null )
		routes.filter( item => item.name === this.props.name ?  console.log(" 아이템 컴포넌트", item) : null )
		routes.map( item => console.log("*TabView* routes list: ", item));
		// console.log("component >>>>>>>>>>>>>>> ", this.state.component);
	}

	handleSelect(key) {
		alert(key)
		this.setState({ key });
	}

	remove = (targetKey) => {
        const { activeKey, items } = this.state;
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        this.setState({
            items: newPanes,
            activeKey: newActiveKey,
        });
    };

	onChange = (newActiveKey) => {
        this.setState({ activeKey: newActiveKey });
    };

	add = () => {
        const { items } = this.state;
        const newActiveKey = `newTab${this.newTabIndex++}`;
        const newPanes = [...items];
        newPanes.push({
            label: "New Tab",
            children: <EasyTables />,
            key: newActiveKey,
        });
        this.setState({
            items: newPanes,
            activeKey: newActiveKey,
        });
    };

	// onEdit = (targetKey, action) => {
    //     if (action === "add") {
    //         this.add();
    //     }
	// 	// else {
    //     //     this.remove(targetKey);
    //     // }
    // };

	render() {
		const { activeKey, items } = this.state;
		return (
			<>
			<button onClick={this.add.bind(this)}> Add </button>
				<Tabs
					hideAdd
					type="editable-card"
					onChange={this.onChange}
					activeKey={activeKey}
					// onEdit={this.onEdit}
					items={items}
				/>
			</>
			// <Tab.Container
			// 	id="live-feeds-tabs"
			// 	activeKey={this.state.key}
			// 	onSelect={this.handleSelect.bind(this)}
			// >
			// 	{/* <JarvisWidget id="LiveFeeds" */}
			// 	{/* <JarvisWidget togglebutton={false} editbutton={false} fullscreenbutton={false} colorbutton={false} deletebutton={false}> */}
			// 	<JarvisWidget>
			// 		<header>
			// 			{/* <Nav bsStyle="tabs" className="pull-left dashboard-widget-tabs"> */}
			// 			<Nav bsStyle="tabs" className="pull-left">
			// 				<NavItem eventKey={ this.state.key  }>
			// 					<span className="hidden-mobile hidden-tablet"> { this.state.key  } </span>
			// 					<button
			// 						className="close" style={{ paddingLeft: 4, fontSize: 12, lineHeight: 1.7 }}
			// 						onClick={ this.handleSelect.bind(this) }
			// 					>
			// 						<i className="fa fa-times" />
			// 					</button>
			// 				</NavItem>
			// 			</Nav>
			// 		</header>

			// 		<div className="no-padding">
			// 			<div className="widget-body">
			// 				<Tab.Content animation mountOnEnter={true} unmountOnExit={true}>
			// 					<Tab.Pane eventKey={ this.state.key }>
			// 						{/* route 컴포넌트 >>>>> */}

			// 						<NavLink to={`/graphs/easy-pie-charts`} title={`휴`} activeClassName="active" > 링크 </NavLink>

			// 						{/* <div className="padding-10 no-padding-bottom" tab={ this.state.key }> */}
			// 							{ this.props.children }
			// 						{/* </div> */}
			// 					</Tab.Pane>
			// 				</Tab.Content>
			// 			</div>
			// 		</div>
			// 	</JarvisWidget>
			// </Tab.Container>
		)
	}
}