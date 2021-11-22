import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

// Provider, Consumer - GuthubContext.Provider

const GithubProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser);

    const [repos, setRepos] = useState(mockRepos);
    
    const [followers, setFollowers] = useState(mockFollowers);

    // request loading
    const [requests, setRequests] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // error
    const [error, setError] = useState({ show: false, msg: "" });

    const searchGithubUsers = async (user) => {
        toggleError();
        setIsLoading(true);
        const res = await axios(`${rootUrl}/users/${user}`).catch(err => console.log(err))

        if (res) {
            setGithubUser(res.data)
        } else {
            toggleError(true, 'there is no user with that username')
        }
        checkRequests();
        setIsLoading(false);
    }

    // check rate
    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
            .then(({ data }) => {
                let { rate: { remaining } } = data;

                
                setRequests(remaining);
                if (remaining === 0) {
                    toggleError(true, 'sorry, you have exceeded your hourly rate limit!');
                }
            })
            .catch((err) => console.log(err))
    }

    function toggleError(show=false, msg='') {
        setError({ show, msg });
    }

    // error

    useEffect(checkRequests, [])
    
    return (
        <GithubContext.Provider value={{githubUser,repos,followers,requests,error, searchGithubUsers,isLoading}}>{children}</GithubContext.Provider>
    );
};

export { GithubProvider, GithubContext };