<!DOCTYPE html>
<html>

<head>
    <title>Entity Relationship Diagram</title>
    @vite('resources/css/app.css')
</head>

<body>
    <div class="flex flex-col items-center p-10 text-center">
        <div class="flex flex-wrap justify-center gap-10 w-full max-w-7xl">
            <div class="flex flex-col items-center md:basis-1/3">
                <h3 class="text-lg font-semibold mb-2">Entity Relationship Diagram</h3>
                <img src="{{ $erdPlantumlUrl }}" alt="Entity Relationship Diagram" class="w-full" />
            </div>
        </div>
    </div>
</body>

</html>
