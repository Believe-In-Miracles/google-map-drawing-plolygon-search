  // This example creates a simple polygon representing the Bermuda Triangle.
// When the user clicks on the polygon an info window opens, showing
// information about the polygon's coordinates.
let map;
let infoWindow;
// Driver Code
polygon1 = [];
let INF = 10000;
  
class Point
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
    }
}
const triangleCoords = [
    { lat: 25.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 30.321, lng: -64.757 },
    { lat: 35.321, lng: -69.757 },
    { lat: 39.321, lng: -74.757 },
    { lat: 32.321, lng: -80.757 },
    { lat: 25.774, lng: -80.19 },
];
for(let i=0;i<triangleCoords.length-1;i++){
    polygon1.push(new Point(triangleCoords[i]['lat'],triangleCoords[i]['lng']));
}
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 5,
    center: { lat: 24.886, lng: -70.268 },
    mapTypeId: "terrain",
  });

  // Define the LatLng coordinates for the polygon.
 
  // Construct the polygon.
  const bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });
  map.addListener("click", pickPoint);
  bermudaTriangle.setMap(map);
  // Add a listener for the click event.
  bermudaTriangle.addListener("click", showArrays);
  infoWindow = new google.maps.InfoWindow();
}

function pickPoint(event) {
    console.log("|"+event.latLng.lat() +
    "," +
    event.latLng.lng());
    let p1 = new Point(event.latLng.lat(), event.latLng.lng());
    let contentString =
    "<b>Jason polygon</b><br>" +
    "Clicked location: <br>" +
    event.latLng.lat() +
    "," +
    event.latLng.lng() +
    "<br>";
    if (isInside(polygon1, polygon1.length, p1))
    {
        contentString="Inside ? YES<br>"+contentString;
        console.log("YES");
        // document.write("Yes<br>");
    }
    else
    {
        contentString="Inside ? NO<br>"+contentString;
        console.log("NO");
        // document.write("No<br>");
    }
    infoWindow.setContent(contentString);
    infoWindow.setPosition(event.latLng);
    infoWindow.open(map);
}
function showArrays(event) {
    pickPoint(event);
  // Since this polygon has only one path, we can call getPath() to return the
  // MVCArray of LatLngs.
//   const polygon = this;
//   const vertices = polygon.getPath();
//   let contentString =
//     "<b>Jason polygon</b><br>" +
//     "Clicked location: <br>" +
//     event.latLng.lat() +
//     "," +
//     event.latLng.lng() +
//     "<br>";

//   // Iterate over the vertices.
//   for (let i = 0; i < vertices.getLength(); i++) {
//     const xy = vertices.getAt(i);

//     contentString +=
//       "<br>" + "Coordinate " + i + ":<br>" + xy.lat() + "," + xy.lng();
//   }

//   // Replace the info window's content and position.
//   infoWindow.setContent(contentString);
//   infoWindow.setPosition(event.latLng);
//   infoWindow.open(map);
}


  
// Given three collinear points p, q, r,
    // the function checks if point q lies
    // on line segment 'pr'
function onSegment(p,q,r)
{
     if (q.x <= Math.max(p.x, r.x) &&
            q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) &&
            q.y >= Math.min(p.y, r.y))
        {
            return true;
        }
        return false;
}
  
// To find orientation of ordered triplet (p, q, r).
    // The function returns following values
    // 0 --> p, q and r are collinear
    // 1 --> Clockwise
    // 2 --> Counterclockwise
function orientation(p,q,r)
{
    let val = (q.y - p.y) * (r.x - q.x)
                - (q.x - p.x) * (r.y - q.y);
   
        if (val == 0)
        {
            return 0; // collinear
        }
        return (val > 0) ? 1 : 2; // clock or counterclock wise
}
  
// The function that returns true if
    // line segment 'p1q1' and 'p2q2' intersect.
function  doIntersect(p1,q1,p2,q2)
{
    // Find the four orientations needed for
        // general and special cases
        let o1 = orientation(p1, q1, p2);
        let o2 = orientation(p1, q1, q2);
        let o3 = orientation(p2, q2, p1);
        let o4 = orientation(p2, q2, q1);
   
        // General case
        if (o1 != o2 && o3 != o4)
        {
            return true;
        }
   
        // Special Cases
        // p1, q1 and p2 are collinear and
        // p2 lies on segment p1q1
        if (o1 == 0 && onSegment(p1, p2, q1))
        {
            return true;
        }
   
        // p1, q1 and p2 are collinear and
        // q2 lies on segment p1q1
        if (o2 == 0 && onSegment(p1, q2, q1))
        {
            return true;
        }
   
        // p2, q2 and p1 are collinear and
        // p1 lies on segment p2q2
        if (o3 == 0 && onSegment(p2, p1, q2))
        {
            return true;
        }
   
        // p2, q2 and q1 are collinear and
        // q1 lies on segment p2q2
        if (o4 == 0 && onSegment(p2, q1, q2))
        {
            return true;
        }
   
        // Doesn't fall in any of the above cases
        return false;
}
  
// Returns true if the point p lies
    // inside the polygon[] with n vertices
function  isInside(polygon,n,p)
{
    // There must be at least 3 vertices in polygon[]
        if (n < 3)
        {
            return false;
        }
   
        // Create a point for line segment from p to infinite
        let extreme = new Point(INF, p.y);
   
        // Count intersections of the above line
        // with sides of polygon
        let count = 0, i = 0;
        do
        {
            let next = (i + 1) % n;
   
            // Check if the line segment from 'p' to
            // 'extreme' intersects with the line
            // segment from 'polygon[i]' to 'polygon[next]'
            if (doIntersect(polygon[i], polygon[next], p, extreme))
            {
                // If the point 'p' is colinear with line
                // segment 'i-next', then check if it lies
                // on segment. If it lies, return true, otherwise false
                if (orientation(polygon[i], p, polygon[next]) == 0)
                {
                    return onSegment(polygon[i], p,
                                    polygon[next]);
                }
   
                count++;
            }
            i = next;
        } while (i != 0);
   
        // Return true if count is odd, false otherwise
        return (count % 2 == 1); // Same as (count%2 == 1)
}
  

                              
// let n = polygon1.length;
// let p = new Point(4.5, 5.5);
// let p1 = new Point(30, -74);
// if (isInside(polygon1, n, p1))
// {
//     console.log("YES");
//     // document.write("Yes<br>");
// }
// else
// {
//     console.log("NO");
//     // document.write("No<br>");
// }
                    