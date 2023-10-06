const githubForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');
const accessToken = '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'; 

githubForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const searchTerm = searchInput.value;
  
  if (searchTerm === '') {
    alert('Please enter a search term.');
    return;
  }
  
  userList.innerHTML = '';
  reposList.innerHTML = '';
  
  fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `Bearer ${accessToken}` 
    }
  })
    .then((response) => response.json())
    .then((data) => {
      const users = data.items;
      
      if (users.length === 0) {
        alert('No users found.');
        return;
      }
      
      users.forEach((user) => {
        const li = document.createElement('li');
        const avatar = document.createElement('img');
        const username = document.createElement('a');
        
        avatar.src = user.avatar_url;
        avatar.alt = `${user.login} avatar`;
        username.href = user.html_url;
        username.textContent = user.login;
        
        li.appendChild(avatar);
        li.appendChild(username);
        userList.appendChild(li);
        
        li.addEventListener('click', () => {
          reposList.innerHTML = '';
          
          fetch(`https://api.github.com/users/${user.login}/repos`, {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
              'Authorization': `Bearer ${accessToken}` 
            }
          })
            .then((response) => response.json())
            .then((repos) => {
              if (repos.length === 0) {
                alert('No repositories found for this user.');
                return;
              }
              
              repos.forEach((repo) => {
                const repoLi = document.createElement('li');
                const repoName = document.createElement('a');
                
                repoName.href = repo.html_url;
                repoName.textContent = repo.name;
                
                repoLi.appendChild(repoName);
                reposList.appendChild(repoLi);
              });
            })
            .catch((error) => {
              console.error('Error fetching repositories:', error);
              alert('An error occurred while fetching repositories.');
            });
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      alert('An error occurred while fetching users.');
    });
});