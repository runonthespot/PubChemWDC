# PubChem Tableau 10 Web Connector
PubChem 3d chemical web data connector for Tableau 10

This web connector creates a data source that you can use to visualize PubChem compounds in Tableau 10.

Details of how to use it here: https://www.youtube.com/embed/QV6N-5dCBrE

Also includes a Tableau Workbook demonstrating how the compound can be visualized in 3d

Known issues:
* Certain compounds don't have 3d conformers in the JSON, which may cause issues.
* Currently the Tableau 10 web connector browser seems to crash on mac if you embed a youtube video.
* Mac web connector doesn't seem to allow you to do joining of two data sources if either is sourced from a customer WDC.  Consequently, to make the 3d element work, this was built into this initial version, although an earlier attempt provided the degrees table as a separate table.
