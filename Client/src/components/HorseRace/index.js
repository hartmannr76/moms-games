import {Component, h, Fragment} from "preact";
import HorseRacer from './race_horse.svg';

const Horse = ({name, offset}) => {
    const cl = offset > 0 ? `col offset-${offset}` : 'col';
    return (
        <div className="row" style={{height: '65px'}}>
            <div className="col-1">{name}</div>
            <div className={cl} data-offset={offset}>
                <img src={HorseRacer} style={{width: '80px'}} />
            </div>
        </div>
    )
}

export default class HorseRace extends Component {
    state = {
        horses: Array(10).fill().map((_, i) => {
            return {
                name: i+1,
                offset: 0,
            };
        })  
    };
    
    reset = () => {
        this.setState({
            horses: Array(10).fill().map((_, i) => {
                return {
                    name: i+1,
                    offset: 0,
                };
            })
        })
    }
    
    move = () => {
        const k = this.getRandomIntInclusive(0, 9);
        const newHorses = [...this.state.horses];
        newHorses[k].offset = newHorses[k].offset+1;
        this.setState({horses: newHorses});
    }

    getRandomIntInclusive = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
    }
    
    render() {
        return (
        <Fragment>
            <div className="row">
                <button className="btn btn-primary" onClick={this.move}>Move</button>
                <button className="btn btn-warning" onClick={this.reset}>Reset</button>
            </div>
            <div className="row">
                {Array.from(Array(11).keys()).map(i => {
                    if (i === 0) {
                        return (<div className="offset-1 col">Start</div>);
                    } else {
                        return (<div className="col" style={{textAlign: 'center'}}>{i}</div>)
                    }
                })}
            </div>
            {this.state.horses.map(x => <Horse name={x.name} offset={x.offset} />)}
        </Fragment>);
    }
}