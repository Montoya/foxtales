const validateFoxTale = (tale) => { 
  const output = new Array()
  try { 
    tale = JSON.parse(tale)
    if(typeof tale.title == "string") { 
      if(tale.title.length > 1 && tale.title.length < 26) { 
        output.push({ 
          success: "Title"
        })
      }
      else { 
        output.push({
          error: "Title should be between 2 and 25 characters long"
        })
      }
    }
    else { 
      output.push({
        error: "Title not found or not a valid string"
      })
    }
    if(typeof tale.author == "object" && Object.keys(tale.author).includes("fid","name","display_name")) { 
      output.push({
        success: "Author"
      })
    }
    else { 
      output.push({
        error: "Author not found or not a valid object containing fid, name, and display_name"
      })
    }
    if(typeof tale.pages == "object") { 
      const pageKeys = Object.keys(tale.pages); 
      if(pageKeys.includes("start") && pageKeys.length > 1) { 
        output.push({
          success: "Tale has a start page and at least one other page"
        })
      }
      else { 
        output.push({
          error: "You must have at least 2 pages and one must be labeled 'start'"
        })
      }
    }
    else { 
      output.push({
        error: "Pages not found"
      })
    }
  } catch(e) { 
    console.error(e);
    output.push({
      error: "Invalid JSON"
    })
  }
  return output; 
}