const styles = {
    active_cells: {
        line: {
            color: '#4C4C4C',
            weight: 0.2
        }
    },
    area: {
        weight: 2,
        opacity: 0.7,
        color: '#1D7FED',
        fill: '#1D7FED',
        dashArray: '5,3'
    },
    bounding_box: {
        color: '#000',
        weight: 0.5,
        fill: false
    },
    grid: {
        weight: 1,
        opacity: 1,
        color: '#1D7FED',
        fill: false
    },
    chd: {
        weight: 5,
        color: '#ED8D05',
        opacity: 1,
        fill: false
    },
    ghb: {
        weight: 5,
        color: '#ED8D05',
        opacity: 1,
        fill: false
    },
    hob: {
        radius: 3,
        color: 'green',
        weight: 1,
        fillColor: '#FBBD08',
        fillOpacity: 1
    },
    rch: {
        weight: 2,
        color: '#95549f',
        opacity: 0.7,
        fillOpacity: 0.3
    },
    riv: {
        weight: 5,
        color: '#1D7FED',
        opacity: 1
    },
    riv_op: {
        radius: 5,
        color: '#4C4C4C',
        weight: 2,
        fillColor: '#1EB1ED',
        fillOpacity: 0.7
    },
    wel: {
        cw: {
            radius: 4,
            color: 'black',
            weight: 2,
            fillColor: '#4CAF53',
            fillOpacity: 0.7
        },
        puw: {
            radius: 4,
            color: 'black',
            weight: 2,
            fillColor: '#0288D1',
            fillOpacity: 0.7
        },
        iw: {
            radius: 4,
            color: 'black',
            weight: 2,
            fillColor: '#1D7FED',
            fillOpacity: 0.7
        },
        inw: {
            radius: 4,
            color: 'black',
            weight: 2,
            fillColor: '#FBBD08',
            fillOpacity: 0.7
        },
        irw: {
            radius: 4,
            color: 'black',
            weight: 2,
            fillColor: '#4CAF53',
            fillOpacity: 0.7
        },
        opw: {
            radius: 4,
            color: '#D50E00',
            weight: 2,
            fillColor: '#FF5B4D',
            fillOpacity: 0.7
        },
        sniw: {
            radius: 5,
            color: 'red',
            weight: 2,
            fillColor: '#4CAF53',
            fillOpacity: 0.7
        },
        snpw: {
            radius: 5,
            color: 'red',
            weight: 2,
            fillColor: '#0288D1',
            fillOpacity: 0.7
        },
        prw: {
            radius: 3,
            color: 'black',
            weight: 1,
            fillColor: '#0288D1',
            fillOpacity: 0.7
        },
        rbf: {
            radius: 5,
            color: 'black',
            weight: 1,
            fillColor: '#FBBD08',
            fillOpacity: 1
        },
        smw: {
            radius: 5,
            color: 'black',
            weight: 1,
            fillColor: '#FF5B4D',
            fillOpacity: 1
        },
        snw: {
            radius: 5,
            color: 'black',
            weight: 1,
            fillColor: '#FBBD08',
            fillOpacity: 1
        },
        snifw: {
            radius: 5,
            color: '#63b3ea',
            weight: 2,
            fillColor: '#bbdff6',
            fillOpacity: 0.7
        },
        activeWell: {
            fillColor: '#FBBD08'
        }
    },
    op: {
        radius: 5,
        color: '#4C4C4C',
        weight: 2,
        fillColor: '#4C4C4C',
        fillOpacity: 1
    },
    op_temp: {
        radius: 5,
        color: '#4C4C4C',
        weight: 2,
        fillColor: '#4C4C4C',
        fillOpacity: 0.5
    },
    op_selected: {
        radius: 7,
        color: '#D50E00',
        weight: 1,
        fillColor: '#D50E00',
        fillOpacity: 1
    },
    default: {
        radius: 5,
        weight: 2,
        opacity: 1,
        color: '#1D7FED',
        dashArray: '1',
        fillColor: '#1D7FED',
        fillOpacity: 0.7
    }
};

export default styles;