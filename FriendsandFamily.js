var data_file = "FriendsandFamily.json";
var httpRequest;

function getRequest()
{
  request = null;

  try
  {
  request = new XMLHttpRequest();
  }
  catch(e)
  {
    try
    {
      request = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
      try
      {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e)
      {
        console.error("Somethings not working ):")
      }
    }
  }
  return request;
}

//searches JSON file
//generates relationship select element
function generateOptions()
{
    httpRequest = getRequest();

    httpRequest.onreadystatechange = function()
    {
        if (httpRequest.readyState == 4)
        {
            jsonObj = JSON.parse(httpRequest.responseText);
            text = "<option value='All Relationships'>All Relationships</option>";
            relationshipList = [];
            counter = 0;
            for (i = 0; i < jsonObj.people.length; i++)
            {
                matchFound = false;
                for (j = 0; j < relationshipList.length; j++)
                {

                    if (relationshipList[j] === jsonObj.people[i].relation)
                    {
                        matchFound = true;
                        break;
                    }
                }

                if (!matchFound)
                {
                    relationshipList[counter] = jsonObj.people[i].relation;
                    counter++;
                }
            }

            for (i = 0; i < relationshipList.length; i++)
            {
                text = text + "<option value=\"" + relationshipList[i] + "\">" + relationshipList[i] + "</option>";
            }
            document.getElementById("RelationSelect").innerHTML = text;
        }
    }
    httpRequest.open("GET", data_file, true);
    httpRequest.send();
}

//starts search with relationship and filters anything out that doesnt match wanted relationship
function startSearch()
{
    httpRequest = getRequest();
    if (httpRequest !== null)
    {
        httpRequest.onreadystatechange = function()
        {
            if (httpRequest.readyState == 4)
            {
                jsonObj = JSON.parse(httpRequest.responseText);
                table = "";

                peopleList = searchByRelation(jsonObj);
                peopleList = searchByName(peopleList);

                for (i = 0; i < peopleList.length; i++)
                {
                    table += "<tr><td>" + peopleList[i].name + " " + peopleList[i].lname + "</td><td>" + peopleList[i].relation + "</td></tr>";
                }

            // Display table only if results found, otherwise state that none were found
                if (table !== "")
                {
                    document.getElementById("friendsFamilyList").innerHTML = table;
                }
                else
                {
                    document.getElementById("friendsFamilyList").innerHTML = "<tr><td>No Results Found</td><td>No Results Found</td></tr>";
                }
            }
        }
        httpRequest.open("GET", data_file, true);
        httpRequest.send();
    }
    else
    {
        console.error("Invalid Request: Null");
    }
}

//search specific JSON object by relationship option selected
function searchByRelation(jsonObj)
{
    peopleList = [];
    counter = 0;
    for (i = 0; i < jsonObj.people.length; i++)
    {
        if (jsonObj.people[i].relation == document.getElementById("RelationSelect").value
                || document.getElementById("RelationSelect").value === "All Relationships")
        {
            peopleList[counter] = jsonObj.people[i];
            counter++;
        }
    }

    return peopleList;
}

//search people array for name entered and returns match
function searchByName(peopleList)
{
    newPeopleList = [];
    counter = 0;


    for (i = 0; i < peopleList.length; i++)
    {
  // Convert to upper case to be case-insensitive
        if ((peopleList[i].name + " " + peopleList[i].lname).toUpperCase().indexOf(document.getElementById("NameSearch").value.toUpperCase()) > -1
                || document.getElementById("NameSearch").value == "")
        {
            newPeopleList[counter] = peopleList[i];
            counter++;
        }
    }

    return newPeopleList;
}

function resetSearch()
{
    document.getElementById("RelationSelect").value = "All Relationships";
    document.getElementById("NameSearch").value = "";
    M.FormSelect.init(document.querySelectorAll('select'));
    startSearch();
}
