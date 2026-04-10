const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    // The animal field is required and added in the form, but we should still check for it to prevent any issues with the server
    const animal = e.target.querySelector('#domoAnimal').value;

    if (!name || !age || !animal) {
        helper.handleError('All fields are required!');
        return false;
    }

    // Send the data to the server and reload the domos on success
    helper.sendPost(e.target.action, { name, age, animal }, onDomoAdded);
    return false;

}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="animal">Favorite Animal: </label>
            <input id="domoAnimal" type="text" name="animal" placeholder="Domo's Favorite Animal" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
}

const deleteDomo = (id, onDomoDeleted) => {

    // Send the delete request to the server and reload the domos on success
    helper.sendDelete(`/deleteDomo/${id}`, onDomoDeleted);
};

const DomoList = (props) => {
    const [domos, setDomos] = useState([]);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const result = await response.json();
            setDomos(result.domos);
        };

        loadDomosFromServer();

    }, [props.reloadDomos]);
    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }
    const domoNodes = domos.map((domo) => {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoAnimal">Favorite Animal: {domo.animal}</h3>
                <button className="deleteDomo" id={domo._id} type="button" onClick={() => deleteDomo(domo._id, props.triggerReload)}>
                    Delete
                </button>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
}

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    const triggerReload = () => {
        setReloadDomos(!reloadDomos);
    };

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={triggerReload} />
            </div>
            <div id="domos">
                <DomoList
                    domos={[]}
                    reloadDomos={reloadDomos}
                    triggerReload={triggerReload}
                />
            </div>
        </div>
    );
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;